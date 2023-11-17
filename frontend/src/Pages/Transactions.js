import React from "react";
import { useState, useEffect } from "react";
import DataGrid, {
    Column,
    Editing,
    Popup,
    Paging,
    Lookup,
    Form,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import transactionData from "../Transaction-Data/transactionData";
import { Box } from "@mui/material";
import category from "../Transaction-Data/category";
import transactionType from "../Transaction-Data/transactionType";

const notesEditorOptions = { height: 100 };
const Transactions = () => {
    // const [redirect, updateRedirect] = useState(false);

    // useEffect(() => {
    //     const user = localStorage.getItem('user');
    //     console.log(user);
    //     if (!user) {
    //         updateRedirect(true);
    //     }
    // }, []);

    // if (redirect) {
    //     return <Navigate to="/register" />
    // }

    const [transactionsData, updateTransactionsData] = useState([]);

    const [currKey, updateCurrKey] = useState();

    const printNewRow = (e) => {
        console.log(e + " new row");
    };

    const printUpdateedRow = (e) => {
        console.log(e + " updated row");
    };
    const printDeleteRow = (e) => {
        console.log(e + " delete row");
    };

    const printt = () => {
        console.log("changes");
    };

    useEffect(() => {
        updateTransactionsData(transactionData);
    }, [transactionData]);

    useEffect(() => {
        console.log(transactionsData);
    }, [transactionsData]);

    return (
        <Box
            sx={{
                width: "80%",
                p: "20px",
                display: "block",
                margin: "10px auto",
            }}
        >
            <DataGrid
                dataSource={transactionsData}
                keyExpr="ID"
                showBorders={true}
                allowColumnResizing
                repaintChangesOnly={true}
                // onEditingStart={updateCurrKey()}
                onRowInserted={(e) => printNewRow(e)}
                onRowUpdated={(e) => printUpdateedRow(e)}
                onRowRemoved={(e) => printDeleteRow(e)}
                onSaved={printt}
            >
                <Paging enabled={true} pageSize={10} />
                <Editing
                    refreshMode="full"
                    mode="popup"
                    useIcons={true}
                    allowAdding={true}
                    allowUpdating={true}
                    allowDeleting={true}
                >
                    <Popup
                        title="Transaction Information"
                        showTitle
                        width={"60%"}
                        height={"60%"}
                    />
                    <Form>
                        <Item itemType="group" colCount={2} colSpan={2}>
                            <Item dataField="title" isRequired />
                            <Item dataField="transactionType" isRequired />
                            <Item dataField="amount" isRequired />
                            <Item dataField="date" isRequired />
                            <Item dataField="category" isRequired />
                            <Item
                                dataField="description"
                                editorType="dxTextArea"
                                colSpan={2}
                                editorOptions={notesEditorOptions}
                            />
                        </Item>
                    </Form>
                </Editing>
                <Column dataField="date" dataType="date" />
                <Column dataField="title" />
                <Column dataField="amount" dataType="number" alignment="left" />
                <Column dataField="transactionType" datatype="transactionType">
                    <Lookup
                        dataSource={transactionType}
                        valueExpr="type"
                        displayExpr="name"
                    />
                </Column>
                <Column dataField="category" dataType="category">
                    <Lookup
                        dataSource={category}
                        valueExpr="type"
                        displayExpr="name"
                    />
                </Column>
                <Column dataField="description" visible={false} />
            </DataGrid>
        </Box>
    );
};

export default Transactions;
