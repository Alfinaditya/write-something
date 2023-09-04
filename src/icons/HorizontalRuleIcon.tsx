import { twMerge } from 'tailwind-merge';

const HorizontalRuleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const { className, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 512 512"
      className={twMerge('w-6 h-6', className)}
      {...rest}
    >
      <path d="M32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z" />
    </svg>
  );
};

export default HorizontalRuleIcon;
