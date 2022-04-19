import React from 'react';
import { Typography, Layout } from 'antd';
import styles from './index.module.css';

const { Title, Text, Link } = Typography;
const { Header, Content, Footer } = Layout;

export const HomeLayout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={styles.header}>
        <div>
          <Title level={4} style={{ margin: 0 }}>ρV - undefined project</Title>
        </div>
        <div>
          <Link
            href="https://github.com/thonatos/pV-Next"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </Link>
        </div>
      </Header>

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

export default HomeLayout;

interface Props {}
