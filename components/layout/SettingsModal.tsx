import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { ISettings } from "../../types";
import { SelectInput } from "./SelectInput";
import { TextInput } from "./TextInput";
import { models } from "../../utils/models";
import { ChangeEvent } from "react";

interface SettingsModalProps {
  value: ISettings;
  onChange: (value: ISettings) => void;
  onCancel: () => void;
}

export function SettingsModal(props: SettingsModalProps) {
  const [tempValue, setTempValue] = React.useState(props.value);
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    setTempValue(props.value);
  }, [props.value]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "apikey-input") {
      setTempValue({ ...tempValue, apikey: value });
    } else if (id === "sample-rows-input") {
      setTempValue({ ...tempValue, sampleRows: Number(value) });
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setTempValue({ ...tempValue, model: value });
  };

  return (
    <Modal isOpen={true} onClose={props.onCancel} size="xl">
      <ModalOverlay />
      <ModalContent bg={colorMode === "light" ? "white" : "gray.800"}>
        <ModalHeader borderBottom="1px" borderColor={colorMode === "light" ? "gray.200" : "gray.600"}>
          <Heading size="md">Pengaturan Analisis Data</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <TextInput
            label="Kunci API OpenAI"
            value={tempValue?.apikey || ""}
            onChange={handleTextChange}
            mb={4}
            type="password"
            id="apikey-input"
          />
          <TextInput
            label="Jumlah Baris Sampel untuk Prompt"
            value={tempValue?.sampleRows?.toString() || "10"}
            onChange={handleTextChange}
            type="number"
            mb={4}
            id="sample-rows-input"
          />
          <SelectInput
            label="Model OpenAI"
            value={tempValue?.model || models[0].value}
            options={models}
            onChange={handleSelectChange}
            mb={4}
          />
        </ModalBody>
        <ModalFooter borderTop="1px" borderColor={colorMode === "light" ? "gray.200" : "gray.600"}>
          <Button
            variant="ghost"
            onClick={props.onCancel}
            mr={3}
          >
            Batal
          </Button>
          <Button colorScheme="blue" onClick={() => props.onChange(tempValue)}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}