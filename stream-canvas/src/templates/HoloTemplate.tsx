import type { Schedule } from "../types/schedule"

interface Props {
  schedule: Schedule
}

export default function HololiveTemplate({ schedule }: Props) {

  return (

    <div
      style={{
        width: "1920px",
        height: "1080px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
        color: "white",
        backgroundColor: "rgba(20,20,30,1)"
      }}
    >

      {/* BACKGROUND IMAGE */}
      {schedule.backgroundImage && (

        <img
          src={schedule.backgroundImage}
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            transform: "translate(-50%, -50%)",
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
          backgroundColor: "rgba(10,10,20,0.85)", // ← reemplazo del blur
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
              color: "rgba(255,120,80,1)"
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