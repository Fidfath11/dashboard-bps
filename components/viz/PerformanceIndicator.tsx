// D:\BPS_Dashboard\ai-data-dashboard\components\viz\PerformanceIndicator.tsx

import React from "react";
import { IDataset, IKPI } from "../../types";
import styles from "../../styles/Components.module.scss";
import { runFunc } from "../../utils/parseFunc";
import { formatNumber } from "../../utils/numberFormatter";

export function PerformanceIndicator(
  props: React.PropsWithChildren<{
    config: IKPI;
    data: IDataset;
  }>
) {
  const value = React.useMemo(() => {
    const fallbackValue = "-";
    const result = runFunc(
      props.config.javascriptFunction,
      props.data,
      fallbackValue
    );

    let val: any = result;
    if (typeof result === "object" && result !== null) {
      const keys = Object.keys(result);
      if (keys.length > 0) {
        val = result[keys[0]];
      } else {
        val = fallbackValue;
      }
    }

    if (typeof val === "number") {
      return formatNumber(val);
    }
    return val;
  }, [props.config, props.data]);

  return (
    <div className={styles.performanceIndicator}>
      <div className={styles.label}>
        {props.config.title.replace("Average", "Avg.")}
      </div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}
