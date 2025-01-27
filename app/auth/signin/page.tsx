import { SignInForm } from '@/components/auth/signin-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F8F9] px-4 py-8">
      <div className="w-full max-w-[400px] mb-8">
        <h1 className="text-center text-3xl font-bold text-[#142D42] mb-2">Mr. Investar</h1>
        <p className="text-center text-gray-500">Italy&apos;s Premier Hospitality Investment Platform</p>
      </div>
      <Card className="w-full max-w-[400px] shadow-lg border-[#E0E0E0]">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold text-[#142D42]">Welcome back</CardTitle>
          <CardDescription className="text-gray-500">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
} 