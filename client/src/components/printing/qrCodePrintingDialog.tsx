import { Col, Form, InputNumber, QRCode, Row, Slider, Switch } from "antd";
import { useSavedState } from "../../utils/saveload";
import PrintingDialog from "./printingDialog";
import { useTranslate } from "@refinedev/core";
import { QRCodePrintSettings } from "./printing";

interface QRCodeData {
  value: string;
  label?: JSX.Element;
  errorLevel?: "L" | "M" | "Q" | "H";
}

interface QRCodePrintingDialogProps {
  visible: boolean;
  items: QRCodeData[];
  printSettings: QRCodePrintSettings;
  setPrintSettings: (setPrintSettings: QRCodePrintSettings) => void;
  onCancel: () => void;
  extraSettings?: JSX.Element;
  extraSettingsStart?: JSX.Element;
}

const QRCodePrintingDialog: React.FC<QRCodePrintingDialogProps> = ({
  visible,
  items,
  printSettings,
  setPrintSettings,
  onCancel,
  extraSettings,
  extraSettingsStart,
}) => {
  const t = useTranslate();

  const showContent = printSettings?.showContent === undefined ? true : printSettings?.showContent;
  const textSize = printSettings?.textSize || 5;
  const showSpoolmanIcon = printSettings?.showSpoolmanIcon === undefined ? true : printSettings?.showSpoolmanIcon;

  const elements = items.map((item) => {
    return (
      <div className="print-qrcode-item">
        <div className="print-qrcode-container">
          <QRCode
            className="print-qrcode"
            icon={showSpoolmanIcon ? "/favicon.svg" : undefined}
            value={item.value}
            errorLevel={item.errorLevel}
            type="svg"
            color="#000"
          />
        </div>
        {showContent && <div className="print-qrcode-title">{item.label ?? item.value}</div>}
      </div>
    );
  });

  return (
    <PrintingDialog
      visible={visible}
      title={t("printing.qrcode.title")}
      items={elements}
      printSettings={printSettings.printSettings}
      setPrintSettings={(newSettings) => {
        printSettings.printSettings = newSettings;
        setPrintSettings(printSettings);
      }}
      extraSettingsStart={extraSettingsStart}
      extraSettings={
        <>
          <Form.Item label={t("printing.qrcode.showContent")}>
            <Switch
              checked={showContent}
              onChange={(checked) => {
                printSettings.showContent = checked;
                setPrintSettings(printSettings);
              }}
            />
          </Form.Item>
          <Form.Item label={t("printing.qrcode.textSize")}>
            <Row>
              <Col span={12}>
                <Slider
                  disabled={!showContent}
                  tooltip={{ formatter: (value) => `${value} mm` }}
                  min={2}
                  max={7}
                  value={textSize}
                  step={0.1}
                  onChange={(value) => {
                    printSettings.textSize = value;
                    setPrintSettings(printSettings);
                  }}
                />
              </Col>
              <Col span={12}>
                <InputNumber
                  disabled={!showContent}
                  min={0.01}
                  step={0.1}
                  style={{ margin: "0 16px" }}
                  value={textSize}
                  addonAfter="mm"
                  onChange={(value) => {
                    printSettings.textSize = value ?? 5;
                    setPrintSettings(printSettings);
                  }}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={t("printing.qrcode.showSpoolmanIcon")}>
            <Switch
              checked={showSpoolmanIcon}
              onChange={(checked) => {
                printSettings.showSpoolmanIcon = checked;
                setPrintSettings(printSettings);
              }}
            />
          </Form.Item>
          {extraSettings}
        </>
      }
      style={`
            .print-page .print-qrcode-item {
              display: flex;
              width: 100%;
              max-height: 100%;
              justify-content: center;
            }

            .print-page .print-qrcode-container {
              max-width: ${showContent ? "50%" : "100%"};
              display: flex;
            }

            .print-page .print-qrcode {
              width: auto !important;
              height: auto !important;
            }

            .print-page .print-qrcode-title {
              flex: 1 1 auto;
              font-size: ${textSize}mm;
              color: #000;
              overflow: hidden;
            }

            .print-page canvas, .print-page svg {
              /* display: block; */
              object-fit: contain;
              height: 100% !important;
              width: 100% !important;
              max-height: 100%;
              max-width: 100%;
            }
            `}
      onCancel={onCancel}
    />
  );
};

export default QRCodePrintingDialog;
