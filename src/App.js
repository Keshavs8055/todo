import React from "react";
import Header from "./pages/components/header";
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
  Typography,
  CircularProgress,
  Box,
} from "@material-ui/core";

import { connect } from "react-redux";
import { setUser } from "./redux/user/user.action";
import { auth, createUserDoc } from "./firebase/firebase.utils";

import Homepage from "./pages/homepage";
import { red } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    secondary: red,
  },
});

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
    };
  }
  unsSubsCribeFromAuth = null;
  componentDidMount() {
    const { setUser } = this.props;

    this.unsSubsCribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserDoc(userAuth);

        userRef.onSnapshot((snapshot) => {
          setUser({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
  }
  componentWillUnmount() {
    this.unsSubsCribeFromAuth();
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header />
          <Homepage />
          {this.state.loading ? (
            <Box
              display="flex"
              alignContent="center"
              justifyContent="center"
              margin={2}
            >
              <CircularProgress
                variant="indeterminate"
                size={20}
                color="secondary"
              />
            </Box>
          ) : null}
        </div>
      </ThemeProvider>
    );
  }
}
const mstp = (state) => ({
  user: state.user.user,
});
const mdtp = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(mstp, mdtp)(App);
