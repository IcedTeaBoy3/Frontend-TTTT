import { Flex, Popconfirm } from "antd";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { DeleteOutlined, ExportOutlined, ImportOutlined, PlusCircleOutlined } from "@ant-design/icons";

const ActionButtonGroup = ({
    selectedRowKeys,
    dataTable,
    onExportCSV,
    onExportExcel,
    onImportCSV,
    onImportExcel,
    fileInputRef,
    fileType,
    onFileChange,
    onDeleteMany,
    onCreateNew,
}) => {
    return (
        <Flex
            gap="middle"
            align="center"
            justify="space-between"
            style={{ marginBottom: "20px", flexWrap: "wrap" }}
        >
            <Flex
                gap="middle"
                style={{
                    flexWrap: "wrap",
                    flex: "1 1 300px", // cho responsive
                    justifyContent: "flex-start",
                }}
            >
                <ButtonComponent
                    size="small"
                    disabled={selectedRowKeys.length == 0}
                    icon={<DeleteOutlined />}
                    onClick={onDeleteMany}
                    danger
                    style={{ minWidth: "120px" }}
                >
                    Xoá tất cả
                </ButtonComponent>

                <ButtonComponent
                    size="small"
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={onCreateNew}
                    style={{ minWidth: "120px" }}
                    disabled={!onCreateNew}
                >
                    Thêm mới
                </ButtonComponent>

            </Flex>
            <Flex
                gap="middle"
                style={{
                    flexWrap: "wrap",
                    flex: "1 1 300px", // cho responsive
                    justifyContent: "flex-end",
                }}
            >
                <Popconfirm
                    title="Xuất dữ liệu"
                    okButtonProps={{ style: { backgroundColor: "#52c41a", color: "#fff" } }}
                    cancelButtonProps={{ style: { backgroundColor: "#1890ff", color: "#fff" } }}
                    description="Bạn muốn xuất dữ liệu dưới dạng Excel hay CSV?"
                    onConfirm={onExportExcel}
                    onCancel={onExportCSV}
                    okText="Excel"
                    cancelText="CSV"
                    placement="bottomLeft"
                    disabled={!dataTable || dataTable?.length === 0}
                >

                    <ButtonComponent
                        size="small"
                        type="default"
                        icon={<ExportOutlined />}
                        styleButton={{
                            minWidth: "120px",
                            backgroundColor: "#e8e818",
                            color: "#fff",
                        }}
                        disabled={!dataTable || dataTable?.length === 0}
                    >
                        Export
                    </ButtonComponent>
                </Popconfirm>
                <Popconfirm
                    title="Nhập dữ liệu"
                    description="Bạn muốn nhập dữ liệu từ file CSV hay Excel?"
                    onConfirm={onImportExcel}
                    onCancel={onImportCSV}
                    okText="Excel"
                    cancelText="CSV"
                    placement="bottomLeft"
                    okButtonProps={{ style: { backgroundColor: "#52c41a", color: "#fff" } }}
                    cancelButtonProps={{ style: { backgroundColor: "#1890ff", color: "#fff" } }}
                >
                    <ButtonComponent
                        size="small"
                        type="primary"
                        icon={<ImportOutlined />}
                        style={{ minWidth: "120px", backgroundColor: "#1890ff", color: "#fff" }}
                    >
                        Import
                    </ButtonComponent>
                </Popconfirm>
                {/* Input file ẩn */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={fileType === "excel" ? ".xlsx, .xls" : ".csv"}
                    style={{ display: "none" }}
                    onChange={onFileChange}
                />
            </Flex>
        </Flex>
    )
}

export default ActionButtonGroup