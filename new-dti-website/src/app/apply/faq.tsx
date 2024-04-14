import React, { useState } from 'react';

interface TabContent {
    [key: string]: string;
}


const tabContent: TabContent = {
    'General Questions': `
      <strong style="font-size: 1.2em;">General Questions</strong><br/>
      <strong>Application Review</strong><br/>
      We look through every single application we receive. We fully understand and don’t expect that everyone has a significant amount of past experience. Taking into account your year and past coursework, we will assess your interest in being a part of Cornell Digital Tech & Innovation and your willingness to learn and make a significant contribution.<br/><br/>
      <strong>Interviews to Expect</strong><br/>
      Shortly after applications close, we will offer interviews to candidates we are interested in. These interviews serve as a chance to get to know you in person. We have one behavioral and one technical round for each role interview. During these interviews, talk about your past experience and interest in our team. Then, we will initiate some role-specific exercises to further gauge your thought process and skill set.<br/><br/>
      <strong>Coffee Chatting</strong><br/>
      Coffee chats are casual conversations allow you to find out more about DTI and ask any questions about our team. A “coffee chat” doesn’t need to actually be over coffee, but should be 30 minutes like an actual coffee catch up with a friend. Get the most out of the coffee chat by preparing your questions ahead of time and researching the other person’s experiences first. Find DTI members to chat here.<br/><br/>
      <strong>Decisions?</strong><br/>
      Whether or not you receive an interview invitation, we will email you a definitive decision within a week of applying! We’re happy to answer any questions you have during this time through our email, hello@cornelldti.org.
    `,
    'Behavioral Interviews': `
      <strong style="font-size: 1.2em;">Behavioral Interviews</strong><br/>
      <strong>What to Expect</strong><br/>
      • In our behavioral interviews, you will have the opportunity to share your experiences and passions with us in a casual setting (no need to dress up!). We want to get to know what makes you who you are and what brings you to DTI.<br/>
      • If selected, you will get a zoom invitation in your email. We, as a team, just want to get a better idea of you as a candidate, how you work in a team, and what Cornell DTI means to you.<br/>
      • You can find some behavioral practice online or chat with members about what to expect. This isn't something to stress out about. Believe us, we've all been there. Above all, we want to get to know you.
    `,
    'Technical Interviews': `
      <strong style="font-size: 1.2em;">Technical Interviews</strong><br/>
      <strong>Designer</strong><br/>
      The design technical interview consists of 15 minutes behavioral questions that are more design focused. Then, a 15 minutes portfolio review + 5 minutes of questions. You will present a slide deck on one of your past projects. We'll end with a 25 minute whiteboard challenge where we'll present you with a problem space and you will create a solution solving it.<br/><br/>
      <strong>Developer</strong><br/>
      To prepare for this interview, we recommend reviewing data structures (OOP) and system design. You're expected to perform white-board challenges (yes, no code!) to design features of a website. Ultimately, we want to see how you think and solve problems.<br/><br/>
      <strong>Business</strong><br/>
      Our technical interview questions will comprise of business case studies simulating challenges you may face in your role. We do not expect any specific background knowledge heading into your interview; however, the best way to prepare would be to thoroughly research the expectations of your role. We look for candidates that show passion and the ability to make rational decisions with limited information.<br/><br/>
      <strong>PM</strong><br/>
      Our technical interview questions are similar to questions real product managers get asked in industry. If you google "PM interview questions" you'll find a lot of helpful resources! We recommend following the CIRCLES framework. We'll also send materials to help you prepare at that stage.
    `,
};

const FAQ: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('General Questions');

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen"
            style={{
                backgroundImage: "url('/images/apply_faq.png')",
                backgroundSize: 'cover'
            }}
        >
            <h1 className="text-4xl font-bold text-white mb-4">What's next?</h1>
            <p className="text-lg text-white mb-8">Learn more about DTI's core values and processes below.</p>
            <div className="flex justify-center gap-4 mb-10">
                {Object.keys(tabContent).map((tabName) => (
                    <button
                        key={tabName}
                        onClick={() => setActiveTab(tabName)}
                        className={`text-white font-semibold px-6 py-2 rounded transition-all duration-300
                        ${activeTab === tabName ? 'bg-[#A52424]' : 'bg-black'}`}
                    >
                        {tabName}
                    </button>
                ))}
            </div>
            <div className="text-left w-full md:w-3/4 xl:w-1/2 mx-auto text-white p-4">
                <div dangerouslySetInnerHTML={{ __html: tabContent[activeTab] }} />
            </div>
        </div>
    );
};

export default FAQ;
