import React from 'react';
import { Header, Icon } from 'semantic-ui-react';
import { lan } from '../utils';


class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch = (error, info) => {
    this.setState({ hasError: true });
  }

  render() {
    return (
      this.state.hasError ?
        <div style={{ padding: '50px' }}>
          <Header as="h2"><Icon name="exclamation triangle" color="red" />{lan === 'fi' ? 'Sivua ei voida näyttää' : 'Page cannot be displayed'}</Header>
        </div>
        :
        this.props.children
    );
  }
}

export default ErrorBoundary;
