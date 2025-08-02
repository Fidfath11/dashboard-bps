// D:\BPS_Dashboard\ai-data-dashboard\components\layout\SettingsModal.tsx

import React from "react";
import styles from "../../styles/Components.module.scss";
import gtag from "../../lib/gtag";
import { Button } from "./Button";
import { TextInput } from "./TextInput"; 
import SelectInput from "./SelectInput";
import { GPT_MODEL } from "../../openai/constants";
import {
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

export function SettingsModal(
  props: React.PropsWithChildren<{
    value: {
      apikey: string;
      sampleRows: number;
      model: string;
    };
    onChange?: (value: {
      apikey: string;
      sampleRows: number;
      model: string;
    }) => void;
    onCancel?: () => void;
  }>
) {
  const { colorMode } = useColorMode();
  const [settings, setSettings] = React.useState(props.value);

  const handleApiKeyChange = React.useCallback(
    (apikey: string) => {
      setSettings((prevSettings) => ({ ...prevSettings, apikey }));
    },
    [setSettings]
  );

  const handleRowsSampleChange = React.useCallback(
    (sampleRowsString: string) => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        sampleRows: Number(sampleRowsString),
      }));
    },
    [setSettings]
  );

  const handleModelChange = React.useCallback(
    (model: string) => {
      setSettings((prevSettings) => ({ ...prevSettings, model }));
    },
    [setSettings]
  );

  const handleSave = React.useCallback(() => {
    const { onChange } = props;
    gtag.report("event", "api_key", {
      event_category: "settings",
      event_label: "setting_up",
    });
    onChange?.(settings);
  }, [props.onChange, settings]);

  const handleCancel = React.useCallback(() => {
    const { onCancel } = props;
    onCancel?.();
  }, [props.onCancel]);

  // warna modal berdasarkan colorMode
  const modalBg = colorMode === "light" ? "white" : "gray.800";
  const modalColor = colorMode === "light" ? "black" : "white";

  return (
    <Modal isOpen onClose={handleCancel}>
      <ModalOverlay />
      <ModalContent bg={modalBg} color={modalColor}>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TextInput
            value={settings.apikey}
            onChange={handleApiKeyChange}
            label={
              <>
                API Key{" "}
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://beta.openai.com/account/api-keys"
                >
                  Get your API key here
                </a>
              </>
            }
            type="text"
            mb="4"
          />
          <TextInput
            value={String(settings.sampleRows)}
            onChange={handleRowsSampleChange}
            label="Rows to sample"
            type="number"
            mb="4"
          />
          <SelectInput
            onChange={handleModelChange}
            options={Object.values(GPT_MODEL)}
            title="Model"
            value={settings.model}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={handleCancel} mr={3}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
