import { Label } from "@radix-ui/react-label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useSignupStatus, useNavigation } from "@/lib/hooks"

export function Signup() {
    const { setIsSignedUp } = useSignupStatus()
    const { setCurrentStep } = useNavigation()

    const handleSignup = () => {
        setIsSignedUp(true)
        setCurrentStep("quotes")
    }

    return (
        <div className="max-w-md mx-auto px-6 py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Create Your Account</CardTitle>
                    <CardDescription>Sign up to see all quotes and book services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                    <Button
                        onClick={handleSignup}
                        className="w-full bg-[#f16c63] hover:bg-[#e55a51] text-white"
                    >
                        Sign Up
                    </Button>
                    <div className="space-y-2">
                        <Button
                            onClick={handleSignup}
                            variant="outline"
                            className="w-full bg-transparent"
                        >
                            Continue with Google
                        </Button>
                        <Button
                            onClick={handleSignup}
                            variant="outline"
                            className="w-full bg-transparent"
                        >
                            Continue with Facebook
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
