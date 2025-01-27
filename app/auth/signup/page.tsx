import { SignUpForm } from '@/components/auth/signup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F8F9] px-4 py-8">
      <div className="w-full max-w-[400px] mb-8">
        <h1 className="text-center text-3xl font-bold text-[#142D42] mb-2">Mr. Investar</h1>
        <p className="text-center text-gray-500">Italy&apos;s Premier Hospitality Investment Platform</p>
      </div>
      <Card className="w-full max-w-[400px] shadow-lg border-[#E0E0E0]">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold text-[#142D42]">Create an account</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
} 