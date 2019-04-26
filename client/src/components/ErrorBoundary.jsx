import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch = (error, info) => {
    this.setState({ hasError: true });
  };

  render() {
    return this.state.hasError ? (
      <div style={{ padding: '50px' }}>
        <Header as="h2">
          <Icon name="exclamation triangle" color="red" />
          Sivua ei voida näyttää
        </Header>
      </div>
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
