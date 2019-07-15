import React from 'react';
import { Email, Item, Span, renderEmail } from 'react-html-email';

function createHTML(data, title, description, moreInformation) {
  const header = { paddingTop: '15px' };
  return renderEmail(
    <Email title={title} align="left">
      <Item>{description}</Item>
      <br />
      {Object.keys(data).map(innerObject => (
        <div>
          <Item style={header}>
            <Span fontSize={17}>{data[innerObject].title}</Span>
          </Item>
          {Object.keys(data[innerObject]).map(
            key =>
              key !== 'title' &&
              data[innerObject][key] && (
                <Item>
                  <Span fontSize={13} style={{ display: 'inline-block', width: '300px' }}>
                    <b>{`${key}`}</b>
                  </Span>
                  <Span fontSize={13} style={{ width: '500px' }}>
                    {data[innerObject][key]}
                  </Span>
                </Item>
              )
          )}
        </div>
      ))}
      {moreInformation && <Item>Lisätietoa tarjouspyyntöön: {moreInformation}</Item>}
    </Email>
  );
}

export default createHTML;
