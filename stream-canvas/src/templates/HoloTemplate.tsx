import type { Schedule } from "../types/schedule"

interface Props {
  schedule: Schedule
}

export default function HololiveTemplate({ schedule }: Props) {

  const { backgroundColor, textColor,headerColor } = schedule.templateSettings

  return (

    <div
      style={{
        width: "1920px",
        height: "1080px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
        color: "white",
        backgroundColor: backgroundColor ?? "#0d1117"
      }}
    >

      {/* BACKGROUND IMAGE */}
      {schedule.backgroundImage && (

        <img
          src={schedule.backgroundImage}
          alt=""
          style={{
            position: "absolute",
            top: `${schedule.backgroundY ?? 50}%`,
            left: `${schedule.backgroundX ?? 50}%`,
            scale: `${schedule.backgroundScale ?? 100}%`,
            transform: `translate(-50%, -50%) rotate(${schedule.backgroundRotation ?? 0}deg)`,
            minWidth: "100%",
            minHeight: "100%",
            zIndex: 0
          }}
        />

      )}

      {/* RIGHT PANEL */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "45%",
          height: "100%",
          padding: "40px",
          backgroundColor: "rgba(10,10,20,0.85)",
          zIndex: 1
        }}
      >

        {/* TITLE */}
        <div style={{ marginBottom: "40px" }}>

          <h1
            style={{
              fontSize: "80px",
              fontWeight: 900,
              lineHeight: 1
            }}
          >
            WEEKLY
          </h1>

          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: headerColor ?? "#F5BB27"
            }}
          >
            SCHEDULE
          </h1>

          <p
            style={{
              marginTop: "10px",
              fontSize: "18px",
              color: "rgba(200,200,210,1)"
            }}
          >
            {schedule.weekLabel}
          </p>

        </div>

        {/* EVENTS */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >

          {schedule.events.map(event => (

            <div
              key={event.id}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "16px"
              }}
            >

              {/* DAY */}
              <div
                style={{
                  width: "120px",
                  fontWeight: 900,
                  fontSize: "32px",
                  color: "rgba(120,200,255,1)"
                }}
              >
                {event.day}
              </div>

              {/* TEXT */}
              <div style={{ flex: 1 }}>

                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700
                  }}
                >
                  {event.mainText || "Event"}
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    color: "rgba(200,200,210,1)"
                  }}
                >
                  {event.secondaryText}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}