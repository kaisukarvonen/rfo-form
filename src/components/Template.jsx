import React from 'react';
import { Email, Item, Span, renderEmail } from 'react-html-email';

function createHTML(data, description) {
  const header = { paddingTop: '15px' };

  return renderEmail(
    <Email title="Tarjouspyyntö" align="left">
      {description && <Item>{description}</Item>}
      { Object.keys(data).map(innerObject =>
        (
          <div>
            <Item style={header}><Span fontSize={17}>{data[innerObject].title}</Span></Item>
            { Object.keys(data[innerObject]).map(key =>
              (
                key !== 'title' &&
                <Item>
                  <Span fontSize={13} style={{ display: 'inline-block', width: '200px' }}>
                    {`${key}`}
                  </Span>
                  <Span fontSize={13}>
                    {data[innerObject][key]}
                  </Span>
                </Item>
              ))}
          </div>)
      )}
    </Email>);
}

export default createHTML;
