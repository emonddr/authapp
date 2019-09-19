import {AuthApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
  AuthenticationBindings
} from '@loopback/authentication';
import {PassportBasicAuthProvider} from './provider/basicpassport.provider';
import {CoreTags, addExtension} from '@loopback/core';
import {VerifyFunctionProvider} from './provider/verify_fn_provider';
import {MyAuthenticationSequence} from './sequence/my.authentication-sequence';
import {UserRepository} from './repositories/user.repository';


export {AuthApplication};


export async function main(options: ApplicationConfig = {}) {
  const app = new AuthApplication(options);

  app.component(AuthenticationComponent);


  app.bind('repositories.users').toClass(UserRepository);

  // the verify function for passport-http
  app.bind('authentication.basic.verify').toProvider(VerifyFunctionProvider);

  //registerAuthenticationStrategy(app, PassportBasicAuthProvider);
  // doesn't work ^

  // app
  //   .bind('authentication.strategies.basicAuthStrategy')
  //   .to(PassportBasicAuthProvider)
  //   .tag({
  //     [CoreTags.EXTENSION_FOR]:
  //       AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
  //   });

  addExtension(
    app,
    AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
    PassportBasicAuthProvider,
    {
      namespace:
        AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
    },
  );

  app.sequence(MyAuthenticationSequence);

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
