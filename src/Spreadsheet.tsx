import React, { useState, useCallback } from 'react';
import { Grid, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

type CellData = string | number;

const TOTAL_ROWS = 10000;
const TOTAL_COLS = 10000;
const COLUMN_WIDTH = 100;
const ROW_HEIGHT = 30;

const getColumnHeader = (col: number): string => {
  let header = '';
  while (col >= 0) {
    header = String.fromCharCode((col % 26) + 65) + header;
    col = Math.floor(col / 26) - 1;
  }
  return header;
};

const Spreadsheet: React.FC = () => {
  const [grid, setGrid] = useState<Map<string, CellData>>(new Map());

  const getCellKey = useCallback((row: number, col: number): string => `${row}-${col}`, []);

  const getCellValue = useCallback(
    (row: number, col: number): CellData => grid.get(getCellKey(row, col)) ?? '',
    [grid, getCellKey]
  );

  const handleCellChange = useCallback(
    (row: number, col: number, value: string) => {
      const newGrid = new Map(grid);
      const key = getCellKey(row, col);

      if (value === '') {
        newGrid.delete(key);
      } else {
        newGrid.set(key, value);
      }

      if (col === 0 || col === 1) {
        const aValue = parseFloat(newGrid.get(getCellKey(row, 0)) as string) || 0;
        const bValue = parseFloat(newGrid.get(getCellKey(row, 1)) as string) || 0;
        const result = aValue + bValue;
        newGrid.set(getCellKey(row, 2), result);
      }

      setGrid(newGrid);
    },
    [grid, getCellKey]
  );

  const cellRenderer = useCallback(
    ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
      if (rowIndex === 0) {
        return (
          <div
            style={style}
            className="border border-gray-300 bg-gray-100 flex items-center justify-center font-semibold"
          >
            {columnIndex === 0 ? '' : getColumnHeader(columnIndex - 1)}
          </div>
        );
      }

      if (columnIndex === 0) {
        // Row number
        return (
          <div
            style={style}
            className="border border-gray-300 bg-gray-100 flex items-center justify-center font-semibold"
          >
            {rowIndex}
          </div>
        );
      }

      const cellValue = getCellValue(rowIndex - 1, columnIndex - 1);

      return (
        <div style={style} className="border border-gray-300 p-0">
          <input
            type="text"
            value={cellValue}
            onChange={(e) => handleCellChange(rowIndex - 1, columnIndex - 1, e.target.value)}
            className="w-full h-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    },
    [getCellValue, handleCellChange]
  );

  return (
    <div className="h-screen w-full p-4">
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={TOTAL_COLS + 1} 
            columnWidth={COLUMN_WIDTH}
            height={height}
            rowCount={TOTAL_ROWS + 1} 
            rowHeight={ROW_HEIGHT}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default Spreadsheet;
