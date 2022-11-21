import { createContext, Component } from "react";

export const AppContext = createContext();

export class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      loggedIn: false,
      focusColor: "#4ECCA3",
    };
  }

  updateState = (prevState, newState) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const { loggedIn, focusColor, username } = this.state;
    return (
      <AppContext.Provider
        value={{
          loggedIn,
          focusColor,
          username,
          updateState: this.updateState,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
