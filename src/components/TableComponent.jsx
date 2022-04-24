import * as React from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import { Toolbar, Box, Paper, TableContainer, Table, TableBody, TableHead, TableRow, TableFooter, TablePagination, IconButton, InputBase, Grid, useMediaQuery, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.action.hover,
    // },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const TableComponent = ({ columns, data, tableHooks, initialState = {}, topComponent = null }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        gotoPage,
        setPageSize,
        state,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState,
        },

        useGlobalFilter,
        useSortBy,
        usePagination,
        tableHooks
    );
    const { globalFilter, pageIndex, pageSize } = state;

    const handleChangeRowsPerPage = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        gotoPage(0);
    };

    return (<Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} topComponent={topComponent} />
            <TableContainer>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <StyledTableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <ArrowDropDownIcon />
                                                : <ArrowDropUpIcon />
                                            : ""}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {(page.length > 0 &&
                            page.map((row) => {
                                prepareRow(row);
                                return (<StyledTableRow {...row.getRowProps()} key={row.id}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <StyledTableCell {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </StyledTableCell>
                                        );
                                    })}
                                </StyledTableRow>)
                            })) || <TableRow>
                                <TableCell colSpan={headerGroups?.[0]?.headers.length}>
                                    <Typography className='flex justify-center' variant="h6" component="div">no data....</Typography>
                                </TableCell>
                            </TableRow>}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50, 100]}
                                colSpan={headerGroups?.headers?.length}
                                count={data?.length}
                                rowsPerPage={pageSize}
                                page={pageIndex}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={(e, v) => gotoPage(v)}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    </Box>
    );
};

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const { globalFilter, setGlobalFilter, topComponent } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 }
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} style={matches ? {} : { order: '2' }}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search here..."
                        inputProps={{ 'aria-label': 'search here' }}
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6} style={matches ? { display: 'flex', justifyContent: 'end' } : { marginTop: 5, display: 'flex', justifyContent: 'end', order: '1' }}>
                    {topComponent}
                </Grid>
            </Grid>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    setGlobalFilter: PropTypes.func,
    globalFilter: PropTypes.string,
    topComponent: PropTypes.element
};

export default TableComponent;