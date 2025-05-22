import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <div className="flex h-screen flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-2">401</h1>
            <p className="text-xl">Unauthorized: You must be an authenticated user to access this content.</p>
            <div
            className="pt-4"
            >
                <Button>
                    <Link to='/login'>
                        Return to Login
                    </Link>
                </Button>
            </div>
        </div>
    );
}
