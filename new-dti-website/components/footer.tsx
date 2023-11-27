import React from 'react';
import Image from 'next/image';

type Icon = {
  src: string;
  link: string;
  alt: string;
};

const socialIcons: Icon[] = [
  {
    src: '/github.svg',
    link: 'https://www.github.com/cornell-dti',
    alt: 'Cornell DTI Github'
  },
  {
    src: '/facebook.svg',
    link: 'https://www.facebook.com/cornelldti',
    alt: 'Cornell DTI Facebook'
  },
  {
    src: '/instagram.svg',
    link: 'https://www.instagram.com/cornelldti',
    alt: 'Cornell DTI Instagram'
  },
  {
    src: '/linkedin.svg',
    link: 'https://www.linkedin.com/company/cornelldti',
    alt: 'Cornell DTI LinkedIn'
  },
  {
    src: '/medium.svg',
    link: 'https://medium.com/cornelldti',
    alt: 'Cornell DTI Medium'
  }
];

const Footer: React.FC = () => (
  <div className="w-full h-[146px] inset-x-0 bottom-0 md:px-[30px] lg:px-[60px] bg-stone-950 inline-flex justify-between items-center md:flex-row flex-col">
    <div className="text-neutral-50 text-sm h-fit md:text-lg font-medium flex items-center justify-center ">
      © 2023 Cornell Digital Tech & Innovation Project Team
    </div>
    <div className="flex gap-4 md:h-fit h-fit">
      {socialIcons.map((icon, index) => (
        <a
          key={index}
          href={icon.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 relative"
        >
          <Image className="w-full h-full" src={icon.src} width={36} height={36} alt={icon.alt} />
        </a>
      ))}
    </div>
  </div>
);

export default Footer;
