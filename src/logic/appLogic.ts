import { createLogic } from "redux-logic";
import { APP_BOOTSTRAP } from "../actions/app";
import { appBootstrapSuccess, appBootstrapError } from "../actions/app";
import { signOutPending } from "../actions/auth";
import { usersAllPending } from "../actions/users";
import { bankAccountsAllPending } from "../actions/bankaccounts";

const appBootstrapLogic = createLogic({
  type: APP_BOOTSTRAP,
  latest: true,

  // @ts-ignore
  async process({ httpClient }, dispatch, done) {
    let checkAuth;

    try {
      checkAuth = await httpClient.get(`http://localhost:3001/checkAuth`);

      // additional async
      // e.g. transactions, etc

      const { user } = checkAuth.data;

      dispatch(appBootstrapSuccess({ user }));
      dispatch(usersAllPending());
      //dispatch(notificationsAllPending());
      dispatch(bankAccountsAllPending());
    } catch (error) {
      // @ts-ignore
      dispatch(appBootstrapError({ error: "Unauthorized" }));
      const { pathname } = window.location;
      if (!pathname.match("signin|signup")) {
        dispatch(signOutPending());
      }
    }

    done();
  }
});

export default [appBootstrapLogic];
