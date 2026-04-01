import React, { useState } from 'react'
import ResouceContent from './ResouceContent';

const Resources = () => {
    const [selectedRole, setSelectedRole] = useState("");
    const rolesList = [
        {
            title: "Frontend Developer",
            para: ["A Frontend Developer is responsible for creating the user interface of websites and web applications. They design layouts, navigation menus, buttons, forms, and interactive elements that users see and use. They work with HTML for structure, CSS for styling, and JavaScript for interactivity. Modern frontend developers also use frameworks like React, Angular, or Vue to build dynamic applications. Their goal is to make websites responsive, fast, visually appealing, and easy to use across all devices."],
            link: "https://roadmap.sh/frontend"
        },
        {
            title: "Backend Developer",
            para: ["A Backend Developer builds the server-side logic that powers applications. They handle databases, APIs, authentication systems, and business logic. Backend developers ensure data is securely stored and properly sent to the frontend. They commonly use languages like Node.js, Python, Java, PHP, or C#. They also work with databases such as MySQL, PostgreSQL, or MongoDB. Their main focus is performance, security, and scalability of applications."],
            link: "https://roadmap.sh/backend"
        },
        {
            title: "Fullstack Developer",
            para: ["A Fullstack Developer works on both frontend and backend technologies. They can design user interfaces as well as build server-side systems and manage databases. Fullstack developers understand how the complete system works from user interaction to data storage. They often work with stacks like MERN (MongoDB, Express, React, Node.js) or MEAN. They are highly versatile and can handle entire projects independently."],
            link: "https://roadmap.sh/full-stack"
        },
        {
            title: "Data Analyst",
            para: ["A Data Analyst collects, processes, and interprets data to help businesses make informed decisions. They analyze trends, create reports, and build dashboards using tools like Excel, SQL, Power BI, Tableau, and Python. Data analysts focus on understanding patterns in data and presenting insights clearly to stakeholders. Their work helps companies improve performance and strategy."],
            link: "https://roadmap.sh/data-analyst"
        },
        {
            title: "AI Engineer",
            para: ["An AI Engineer builds intelligent systems that simulate human thinking and decision-making. They develop AI models for tasks like image recognition, speech processing, recommendation systems, and chatbots. They use machine learning and deep learning frameworks such as TensorFlow and PyTorch. AI Engineers combine programming, mathematics, and data science to create smart applications."],
            link: "https://roadmap.sh/ai-engineer"
        },
        {
            title: "Data Engineer",
            para: ["A Data Engineer designs and maintains the infrastructure required for data generation, storage, and processing. They build data pipelines and ensure large amounts of data flow efficiently between systems. They work with big data technologies like Hadoop, Spark, and cloud platforms such as AWS or Azure. Their job is to make data accessible and reliable for analysts and data scientists."],
            link: "https://roadmap.sh/data-engineer"
        },
        {
            title: "Machine Learning Engineer",
            para: ["A Machine Learning Engineer focuses on building and deploying machine learning models into real-world applications. They train algorithms using large datasets and optimize them for accuracy and performance. They also handle model deployment and monitoring. Tools they use include Scikit-learn, TensorFlow, PyTorch, and cloud ML services."],
            link: "https://roadmap.sh/machine-learning"
        },
        {
            title: "Cyber Security",
            para: ["Cyber Security professionals protect systems, networks, and data from cyber attacks. They identify vulnerabilities, perform penetration testing, and implement security measures such as firewalls and encryption. They also monitor systems for threats and respond to incidents. Cyber security is critical for protecting sensitive information in organizations."],
            link: "https://roadmap.sh/cyber-security"
        },
        {
            title: "Data Scientist",
            para: ["A Data Scientist combines statistics, programming, and machine learning to analyze complex data and build predictive models. They work on forecasting, recommendation systems, fraud detection, and business optimization problems. They use tools like Python, R, Pandas, NumPy, and ML libraries. Their role focuses on extracting meaningful insights from data to solve real-world problems."],
            link: "https://roadmap.sh/data-scientist"
        }
    ];
    const selectedRoleData = rolesList.find(
        (role) => role.title === selectedRole
    );
    return (
        <div>
            <div className="min-h-screen w-full bg-gray-900 flex justify-start items-center flex-col overflow-x-hidden lg:flex lg:justify-start lg:items-center overflow-hidden">
                <div className="w-[90vw] bg-gray-800 h-[90vh] mt-7">
                    <div className='w-[90vw] text-gray-300 lg:px-20 h-[20vh] lg:text-1.5xl mt-10 p-5'>
                        <p>NexCode is a platform that shares updates about upcoming hackathons. It helps participants find events and allows organizers to post event details. The website promotes innovation, collaboration, and technical growth.</p></div>
                    <div>
                        <div className='w-[90vw] h-[8vh] flex justify-center items-center mx-auto pr-30 lg:mt-10  lg:w-[90vw] lg:h-[5vh]'>
                            <label className="w-[90vw] h-[8vh] block mb-2 text-sm font-semibold text-gray-700 mx-auto lg:w-[90vw] lg:h-[5vh]"></label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className=" w-[90vw] h-[5vh] mt-[13vh] p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white mx-auto ml-30 mb-25 lg:mr-75 lg:w-[90vw] lg:h-[8vh]"   >
                                <option value="">Choose a Role</option>
                                {rolesList.map((role, index) => (
                                    <option key={index} value={role.title}>
                                        {role.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='w-[80vw] h-[75vh] lg:mx-auto'>
                            <ResouceContent role={selectedRoleData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Resources