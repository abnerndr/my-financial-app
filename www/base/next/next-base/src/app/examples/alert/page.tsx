import { AlertBase } from '@/components/common/alert-base';

export default function AlertPage() {
	return (
		<div className="w-full max-w-md mx-auto h-screen flex justify-center flex-col items-center ">
			<div className="w-full space-y-5">
				<AlertBase
					title="Info Alert"
					description="This is an info alert."
					variant="info"
				/>
				<AlertBase
					title="Success Alert"
					description="This is a success alert."
					variant="success"
				/>
				<AlertBase
					title="Warning Alert"
					description="This is a warning alert."
					variant="warning"
				/>
				<AlertBase
					title="Error Alert"
					description="This is an error alert."
					variant="error"
				/>
			</div>
		</div>
	);
}
