import {BasicStrategy, BasicVerifyFunction} from 'passport-http';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {AuthenticationStrategy} from '@loopback/authentication';
import {Provider} from '@loopback/core';
import {inject} from '@loopback/context';
import {AUTH_STRATEGY_NAME} from '../keys';


export class PassportBasicAuthProvider implements Provider<AuthenticationStrategy> {

  constructor(
    @inject('authentication.basic.verify') private verifyFn: BasicVerifyFunction
  ) {};
  value(): AuthenticationStrategy {
    const basicStrategy = this.configuredBasicStrategy(this.verifyFn);
    return this.convertToAuthStrategy(basicStrategy);
  }

  // Takes in the verify callback function and returns a configured basic strategy.
  configuredBasicStrategy(verifyFn: BasicVerifyFunction): BasicStrategy {
    return new BasicStrategy(verifyFn);
  }

  // Applies the `StrategyAdapter` to the configured basic strategy instance.
  // You'd better define your strategy name as a constant, like
  // `const AUTH_STRATEGY_NAME = 'basic'`
  // You will need to decorate the APIs later with the same name
  convertToAuthStrategy(basic: BasicStrategy): AuthenticationStrategy {
    return new StrategyAdapter(basic, AUTH_STRATEGY_NAME);
  }
}
