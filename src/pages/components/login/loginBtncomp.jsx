import React from 'react';
import { Button } from '@material-ui/core';

import { signInWithGoogle } from '../../../firebase/firebase.utils';

const LoginBtn = () => {
  return (
    <div>
      <Button
        margin="normal"
        style={{ borderRadius: 0 }}
        type="button"
        variant="text"
        disableElevation
        disableRipple
        disableFocusRipple
        disableTouchRipple
        onClick={signInWithGoogle}
      >
        Sign-In
      </Button>
    </div>
  );
};

export default LoginBtn;
