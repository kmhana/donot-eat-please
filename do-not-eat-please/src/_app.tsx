import { AppsInToss } from '@apps-in-toss/framework';
import type { InitialProps } from '@granite-js/react-native';
import { FoodProvider } from 'context/FoodContext';
import type { PropsWithChildren } from 'react';
import { context } from '../require.context';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return <FoodProvider>{children}</FoodProvider>;
}

export default AppsInToss.registerApp(AppContainer, { context });
