import React from 'react';
import { Container, Spacer, Text } from '@nextui-org/react';

import styles from './index.module.css';

export const HomeLayout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <Container
      as="main"
      display="flex"
      direction="column"
      style={{ minHeight: '100vh' }}
    >
      <header className={styles.header}>
        <div>
          <Text h4>ρV - undefined project</Text>
        </div>
        <div>
          <a
            href="https://github.com/thonatos/pV-Next"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=thonatos&type=sponsor"
          frameBorder="0"
          scrolling="0"
          width="170"
          height="20"
          title="GitHub"
          style={{
            marginBottom: '.5rem',
          }}
        />
        <Text>{`@${new Date().getFullYear()} - implements.io`}</Text>
      </footer>
    </Container>
  );
};

export default HomeLayout;

interface Props {}
