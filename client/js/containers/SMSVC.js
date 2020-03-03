import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { sendmycode } from "../redux/actions/generalActions";

class App extends Component {
  static propTypes = {
    sendmycode: PropTypes.func.isRequired,
    ajaxStatus: PropTypes.object.isRequired
  };

  render() {
    const { ajaxStatus, sendmycode } = this.props;

    return (
      <section className="home-content-section">
        <div className="container-fluid">
          <div style={{ margin: "20px auto" }}>
            {/* <input name="verificationCode"/>  or the one bellow*/}
            {/* <input autoComplete="one-time-code" /> */}
            <input name="verificationCode" type="number"/>
          </div>
          <div style={{ margin: "20px auto" }}>
            <button type="button" onClick={sendmycode}>
              Send Code
            </button>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    ajaxStatus: state.ajaxStatus
  };
};

export default connect(mapStateToProps, { sendmycode })(App);
