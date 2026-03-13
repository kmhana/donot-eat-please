import { AppsInToss } from '@apps-in-toss/framework';
import type { InitialProps } from '@granite-js/react-native';
import type { PropsWithChildren } from 'react';
import { context } from '../require.context';
import { FoodProvider } from './context/FoodContext';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return <FoodProvider>{children}</FoodProvider>;
}

export default AppsInToss.registerApp(AppContainer, { context });
