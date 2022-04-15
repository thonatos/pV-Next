import React from 'react';
import { Container, Text } from '@nextui-org/react';

import styles from './index.module.css';

export const BasicLayout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <Container
      as="main"
      display="flex"
      direction="column"
      style={{ height: '100vh' }}
    >
      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <Text>{`@${new Date().getFullYear()} - implements.io`}</Text>
      </footer>
    </Container>
  );
};

export default BasicLayout;

interface Props {}
