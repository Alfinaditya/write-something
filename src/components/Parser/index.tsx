import styles from './style.module.css';

const Parser = ({ content }: { content: string }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className={styles.tiptap}
    />
  );
};

export default Parser;
