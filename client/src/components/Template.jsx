import React from 'react';
import { Email, Item, Span, renderEmail } from 'react-html-email';

function createHTML(data, title, description, moreInformation) {
  return renderEmail(
    <Email title={title} align="left">
      <Item>{description}</Item>
      <br />
      {Object.keys(data).map((innerObject, i) => (
        <div key={i}>
          <Item style={{ paddingTop: 15 }}>
            <Span fontSize={17}>{data[innerObject].title}</Span>
          </Item>
          {Object.keys(data[innerObject]).map(
            (key, ind) =>
              key !== 'title' &&
              data[innerObject][key] && (
                <Item key={ind}>
                  <Span fontSize={13}>
                    <b>{`${key}`}</b>
                    <br />
                  </Span>
                  <Span fontSize={13}>{data[innerObject][key]}</Span>
                  <hr />
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
