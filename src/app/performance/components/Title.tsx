interface Props {
  readonly desc?: string;
  readonly className?: string;
}

const Title: React.FC<Props> = (props) => {
  const { children, desc, ...other } = props;
  return (
    <>
      <div className="title-con">
        <h3 className="title" {...other}>
          {children}
        </h3>
        {desc && <span className="title-desc">{`- ${desc}`} </span>}
      </div>
      <style jsx>{`
        .title-con {
          display: flex;
          align-items: center;
        }
        .title {
          font-size: 20px;
          font-weight: bold;
          line-height: 1;
        }
        .title-desc {
          color: rgba(0, 0, 0, 0.5);
          margin-left: 10px;
        }
      `}</style>
    </>
  );
};
export default Title;
