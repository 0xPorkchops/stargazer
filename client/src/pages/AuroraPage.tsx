import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  
function Aurora() {

    return (
        <div className="flex flex-col items-center justify-center min-w-screen p-10">
            <Carousel opts={{ align: "start", loop: true, }} className="w-full max-w-screen-md">
                <CarouselContent>
                    <CarouselItem>
                        <div className="p-1">
                            <Card>
                                <CardHeader><CardTitle>Short-Term Aurora Forecast</CardTitle></CardHeader>
                                <CardContent className="flex aspect-square items-center justify-center">
                                    <img src="https://services.swpc.noaa.gov/images/animations/ovation/north/latest.jpg" alt="Short-Term Aurora Forecast" className="w-full h-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <Card>
                                <CardHeader><CardTitle>Tonight's Aurora Forecast</CardTitle></CardHeader>
                                <CardContent className="flex aspect-square items-center justify-center">
                                    <img src="https://services.swpc.noaa.gov/experimental/images/aurora_dashboard/tonights_static_viewline_forecast.png" alt="Tonight's Aurora Forecast" className="w-full h-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <Card>
                            <CardHeader><CardTitle>Tomorrow Night's Aurora Forecast</CardTitle></CardHeader>
                                <CardContent className="flex aspect-square items-center justify-center">
                                    <img src="https://services.swpc.noaa.gov/experimental/images/aurora_dashboard/tomorrow_nights_static_viewline_forecast.png" alt="Tomorrow Night's Aurora Forecast" className="w-full h-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
  }
  
  export default Aurora