import React from 'react';
import { Typography, Layout } from 'antd';
import styles from './index.module.css';

const { Text } = Typography;
const { Content, Footer } = Layout;

export const DocLayout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content className={styles.main}>{children}</Content>

      <Footer className={styles.footer}>
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
      </Footer>
    </Layout>
  );
};

export default DocLayout;

interface Props {}
