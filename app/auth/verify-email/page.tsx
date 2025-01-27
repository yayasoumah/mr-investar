import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F8F9] px-4 py-8">
      <div className="w-full max-w-[400px] mb-8">
        <h1 className="text-center text-3xl font-bold text-[#142D42] mb-2">Mr. Investar</h1>
        <p className="text-center text-gray-500">Italy&apos;s Premier Hospitality Investment Platform</p>
      </div>
      <Card className="w-full max-w-[400px] shadow-lg border-[#E0E0E0]">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-[#34D399]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#142D42] text-center">Check your email</CardTitle>
          <CardDescription className="text-gray-500 text-center">
            We&apos;ve sent you a verification link. Please check your email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Once you verify your email, you&apos;ll be able to sign in to your account.
              If you don&apos;t see the email, please check your spam folder.
            </p>
            <p className="text-sm text-gray-500 text-center">
              Return to{' '}
              <a href="/auth/signin" className="font-medium text-[#3FD3CC] hover:text-[#36B3AD] transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 