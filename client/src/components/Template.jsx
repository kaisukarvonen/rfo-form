import React from 'react';
import { reserveRightsToChanges } from '../utils';

const renderRow = (value, title) => {
  const isHeaderRow = title === 'title';
  const spanStyle = { fontSize: '15px' };
  const isArray = Array.isArray(value);
  return value && (isArray ? value.length : true) ? (
    <tr>
      <td style={{ paddingTop: '9px' }}>
        {title && (
          <div>
            <span style={{ fontSize: isHeaderRow ? '18px' : '16px' }}>
              <b>{isHeaderRow ? value : title}</b>
            </span>
            <br />
          </div>
        )}
        {!isHeaderRow ? (
          isArray ? (
            value.map(
              (v) =>
                v && (
                  <div>
                    <span style={spanStyle}>{v}</span>
                    <br />
                  </div>
                )
            )
          ) : (
            <span style={spanStyle}>{value}</span>
          )
        ) : null}
      </td>
    </tr>
  ) : null;
};

const createHTML = (data, description, moreInformation) => {
  return (
    <table width="100%" height="100%" cellPadding="0" cellSpacing="0" border="0" align="left" valign="top">
      <tbody>
        {renderRow(description)}
        <br />
        {Object.entries(data.basicInfo).map((obj) => renderRow(obj[1], obj[0]))}
        {Object.entries(data.food).map((obj) => renderRow(obj[1], obj[0]))}
        {Object.entries(data.activities).map((obj) => renderRow(obj[1], obj[0]))}
        {Object.entries(data.rentalEquipment).map((obj) => renderRow(obj[1], obj[0]))}
        {Object.entries(data.extraServices).map((obj) => renderRow(obj[1], obj[0]))}
        {Object.entries(data.visitDetails).map((obj) => renderRow(obj[1], obj[0]))}
        {moreInformation && renderRow(moreInformation, 'Lisätietoa')}
        {renderRow(<i style={{ fontSize: '12px' }}>{reserveRightsToChanges}</i>)}
      </tbody>
    </table>
  );
};

export default createHTML;
