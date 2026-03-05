import type { Schedule  } from "../types/schedule";

interface Props{
    schedule: Schedule
}

export default function DefaultTemplate({schedule}: Props){
    return(
        <div
      className="relative w-900px h-900px rounded-xl overflow-hidden"
      style={{
        backgroundImage: schedule.backgroundImage
          ? `url(${schedule.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "rgba(255,255,255,1)" 
      }}
    >

      <div className="absolute inset-0 "
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }} />

      <div className="relative p-8">

        <h1 className="text-5xl font-bold text-center">
          {schedule.title}
        </h1>

        <p className="text-center mb-10">
          {schedule.weekLabel}
        </p>

        <div className="space-y-4">

          {schedule.events.map(event => (

            <div
              key={event.id}
              className="flex items-center p-4 rounded-lg"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            >

              <div className="font-bold w-20">
                {event.day}
              </div>

              <div>
                <p className="font-semibold">
                  {event.mainText}
                </p>

                <p className="text-sm opacity-70">
                  {event.secondaryText}
                </p>
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

    )
}