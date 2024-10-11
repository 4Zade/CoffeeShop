// import RegisterForm from '../components/RegisterForm'; // Import the RegisterForm
// import PurchasePage from './PurchasePage';

// export default function HomePage() {
//     return (
//         <div className="flex flex-col items-center">
//             <h1 className="text-3xl font-bold underline text-blue-500">Hello world!</h1>
//             <h2 className="text-2xl mt-4">Register Here</h2>
//             <RegisterForm /> 
//         </div>
//     );
// }

import PurchasePage from './PurchasePage';

export default function HomePage() {
    return (
        <div className="flex flex-col justify-center min-h-screen">
            {/* Render only PurchasePage */}
            <PurchasePage />
        </div>
    );
}
