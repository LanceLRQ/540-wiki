import React from 'react';
import PropTypes from 'prop-types';
import { get, noop } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import myActions from '../store/sagas';

@connect((state) => {
  return {
    counter: get(state, 'test.counter', 0),
  };
}, (dispatch) => bindActionCreators({
  updateCounter: myActions.updateCounter,
}, dispatch))
class TestClassBasedApp extends React.PureComponent {
  static fetchData = async (s) => {
    const counter = get(s, 'test.counter', 0);
    return s.dispatch(myActions.updateCounter({ counter: counter + 1 }));
  };

  componentDidMount() {
    TestClassBasedApp.fetchData(require('../store').store).then();
  }

  handlePlus = () => {
    const { counter, updateCounter } = this.props;
    updateCounter({ counter: counter + 1 });
  };

  render() {
    const { counter } = this.props;
    return <div>
      This is page 2. Counter: {counter}
      <div>
        <button type="button" onClick={this.handlePlus}>Plus!!</button>
      </div>
    </div>;
  }
}

TestClassBasedApp.propTypes = {
  counter: PropTypes.number,
  updateCounter: PropTypes.func,
};

TestClassBasedApp.defaultProps = {
  counter: 0,
  updateCounter: noop,
};

export default TestClassBasedApp;
