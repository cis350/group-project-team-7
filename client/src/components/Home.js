import React from "react";

const Home = () => {
	return (
		<>
			<div className="relative overflow-hidden bg-white">
				<div className="mx-auto max-w-7xl">
					<div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
						<svg
							className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
							fill="currentColor"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
							aria-hidden="true"
						>
							<polygon points="50,0 100,0 50,100 0,100" />
						</svg>

						<main className="mx-auto mt-10 max-w-7xl px-6 sm:mt-12 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
							<div className="sm:text-center lg:text-left">
								<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-5xl">
									<span className="block">Moder Patshala:</span>{" "}
									<span className="block text-mainBlue">
										Guiding Students and Parents to a Brighter Future Since 2004
									</span>
								</h1>
								<div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
									<div className="rounded-md shadow">
										<a
											href="/login"
											className="flex w-full items-center justify-center rounded-md border border-transparent bg-mainBlue px-8 py-3 text-base font-medium text-white hover:bg-darkBlue md:py-4 md:px-10 md:text-lg"
										>
											Login
										</a>
									</div>
									<div className="mt-3 sm:mt-0 sm:ml-3">
										<a
											href="/signup"
											className="flex w-full items-center justify-center rounded-md border border-transparent bg-mainPeach px-8 py-3 text-base font-medium text-white hover:bg-darkPeach md:py-4 md:px-10 md:text-lg"
										>
											Signup
										</a>
									</div>
								</div>
							</div>
						</main>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
