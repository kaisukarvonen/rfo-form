import React from 'react';
import { Email, Item, Span, renderEmail } from 'react-html-email';

function createHTML(data) {
  console.log(data);
  // const daterange = this.dateToStr(data.from, data.to);
  return renderEmail(
    <Email title="Hello World!">
      <Item>
        <Span fontSize={13}>
          laaa:{data.name}
        </Span>
      </Item>
        <Item>
        <Span fontSize={13}>
          laaa:{data.email}
        </Span>
      </Item>
    </Email>);
}

export default createHTML;
