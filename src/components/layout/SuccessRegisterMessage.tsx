type SuccessRegisterMessageProps = {
    message: string;
}

export default function SuccessRegisterMessage(props: SuccessRegisterMessageProps) {
    return (
        <div class="flex flex-col justify-center items-center space-y-4 rounded text-white">
            <div class="flex flex-col space-y-4 w-full max-w-xl p-8 bg-gray-900 rounded">
                <h1 class="text-center text-3xl">Verify Account</h1>
                <p>{props.message}</p>
                <p>
                    Once verified, you'll be able to log into your account&nbsp;
                    <a class="text-blue-500 hover:underline" href="/login/">here</a>
                    .
                </p>
            </div>
        </div>
    )
}
