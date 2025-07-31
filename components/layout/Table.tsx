// D:\BPS_Dashboard\ai-data-dashboard\components\layout\Table.tsx

import React from "react";

// Impor komponen Chakra UI yang dibutuhkan
import {
  Box,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";

// Import dari @tanstack/react-table dan react-virtual
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  RowData,
  Table as ReactTableInstance,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useVirtual } from "react-virtual";
import isEqual from "lodash.isequal";

import { IDataset, IDatasetRecord } from "../../types";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

function useCell(
  getValue: () => unknown,
  index: number,
  id: string,
  table: ReactTableInstance<IDatasetRecord>
) {
  const initialValue = getValue();
  const [value, setValue] = React.useState(initialValue);

  const onBlur = () => {
    if (table.options.meta) {
      table.options.meta.updateData(index, id, value);
    }
  };

  React.useEffect(() => {
    if (!isEqual(initialValue, value)) {
      setValue(initialValue);
    }
  }, [initialValue, value]);

  return {
    value,
    setValue,
    onBlur,
  };
}

const defaultColumn: Partial<ColumnDef<IDatasetRecord>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const { value, setValue, onBlur } = useCell(getValue, index, id, table);

    return (
      <Input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        variant="unstyled"
        size="sm"
        px={0}
      />
    );
  },
};

interface TableProps {
  data: IDataset;
  onChange?: (data: IDataset) => void;
}

export function Table(props: TableProps) {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<IDatasetRecord>[] = React.useMemo(() => {
    const row = props.data?.[0];
    const baseColumns: ColumnDef<IDatasetRecord>[] = [];

    if (row) {
      Object.keys(row).forEach((name) => {
        let minSize = 80;
        if (
          name.toLowerCase().includes("provinsi") ||
          name.toLowerCase().includes("name")
        ) {
          minSize = 150;
        } else if (name.toLowerCase().includes("kode")) {
          minSize = 60;
        }

        baseColumns.push({
          header: name,
          accessorKey: name,
          minSize: minSize,
          size: minSize,
        });
      });
    }

    return baseColumns;
  }, [props.data]);

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: props.data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      sorting,
    },
    onSortingChange: setSorting,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const newData =
          props.data?.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                [columnId as unknown as string]:
                  value as (typeof row)[keyof typeof row],
              };
            }
            return row;
          }) || [];

        if (props.onChange && !isEqual(newData, props.data))
          props.onChange?.(newData);
      },
    },
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <Box
      ref={tableContainerRef}
      overflowX="auto"
      overflowY="auto"
      minH="100px"
      maxH="200px"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      position="relative"
    >
      <ChakraTable variant="simple" size="sm" width="full">
        <Thead bg="gray.50">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    px={2}
                    py={2}
                    textTransform="capitalize"
                    borderBottom="2px solid"
                    borderRight="1px solid"
                    borderColor="gray.200"
                    cursor={header.column.getCanSort() ? "pointer" : "default"}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex alignItems="center" justifyContent="space-between">
                      {header.isPlaceholder ? null : (
                        <Text fontWeight="bold">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Text>
                      )}
                      {{
                        asc: <ArrowUpIcon ml={2} />,
                        desc: <ArrowDownIcon ml={2} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {paddingTop > 0 && (
            <Tr>
              <Td
                colSpan={columns.length}
                style={{ height: `${paddingTop}px` }}
              />
            </Tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <Tr key={row.id} _hover={{ bg: "gray.100" }}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td
                      key={cell.id}
                      px={2}
                      py={1}
                      borderBottom="1px solid"
                      borderRight="1px solid"
                      borderColor="gray.100"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
          {paddingBottom > 0 && (
            <Tr>
              <Td
                colSpan={columns.length}
                style={{ height: `${paddingBottom}px` }}
              />
            </Tr>
          )}
        </Tbody>
      </ChakraTable>
    </Box>
  );
}
