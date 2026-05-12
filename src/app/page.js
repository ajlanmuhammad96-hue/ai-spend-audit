"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [formData, setFormData] = useState({
    tools: [
      {
        tool: "",
        plan: "",
        spend: "",
        seats: "",
      },
    ],
    teamSize: "",
    useCase: "",
  })

  const [auditResult, setAuditResult] = useState(null)

  useEffect(() => {
    const savedData = localStorage.getItem("audit-form")

    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "audit-form",
      JSON.stringify(formData)
    )
  }, [formData])

  const handleToolChange = (index, field, value) => {
    const updatedTools = [...formData.tools]

    updatedTools[index][field] = value

    setFormData({
      ...formData,
      tools: updatedTools,
    })
  }

  const addTool = () => {
    setFormData({
      ...formData,
      tools: [
        ...formData.tools,
        {
          tool: "",
          plan: "",
          spend: "",
          seats: "",
        },
      ],
    })
  }

  const removeTool = (index) => {
    const updatedTools = formData.tools.filter(
      (_, i) => i !== index
    )

    setFormData({
      ...formData,
      tools: updatedTools,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let totalMonthlySavings = 0

    const recommendations = []

    formData.tools.forEach((tool) => {
      const spend = Number(tool.spend)

      if (tool.tool === "Cursor" && tool.plan === "Business") {
        totalMonthlySavings += spend * 0.3

        recommendations.push(
          "Downgrade Cursor Business to Pro for smaller teams."
        )
      }

      if (tool.tool === "ChatGPT" && tool.plan === "Team") {
        totalMonthlySavings += spend * 0.2

        recommendations.push(
          "Consider ChatGPT Plus instead of Team plan."
        )
      }
    })

    const aiSummary =
      "This audit identified opportunities to optimize AI spending and improve subscription efficiency."

    setAuditResult({
      monthlySavings: totalMonthlySavings,
      annualSavings: totalMonthlySavings * 12,
      recommendations,
      aiSummary,
    })
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">
          AI Spend Audit Tool
        </h1>

        <p className="text-gray-400 mb-10">
          Analyze and optimize your AI tool spending.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {formData.tools.map((tool, index) => (
            <div
              key={index}
              className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tool Name"
                  value={tool.tool}
                  onChange={(e) =>
                    handleToolChange(
                      index,
                      "tool",
                      e.target.value
                    )
                  }
                  className="p-4 rounded-xl bg-black border border-zinc-700"
                />

                <input
                  type="text"
                  placeholder="Plan"
                  value={tool.plan}
                  onChange={(e) =>
                    handleToolChange(
                      index,
                      "plan",
                      e.target.value
                    )
                  }
                  className="p-4 rounded-xl bg-black border border-zinc-700"
                />

                <input
                  type="number"
                  placeholder="Monthly Spend ($)"
                  value={tool.spend}
                  onChange={(e) =>
                    handleToolChange(
                      index,
                      "spend",
                      e.target.value
                    )
                  }
                  className="p-4 rounded-xl bg-black border border-zinc-700"
                />

                <input
                  type="number"
                  placeholder="Seats"
                  value={tool.seats}
                  onChange={(e) =>
                    handleToolChange(
                      index,
                      "seats",
                      e.target.value
                    )
                  }
                  className="p-4 rounded-xl bg-black border border-zinc-700"
                />
              </div>

              {formData.tools.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="mt-4 text-red-400"
                >
                  Remove Tool
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addTool}
            className="bg-zinc-800 px-6 py-3 rounded-xl"
          >
            Add Another Tool
          </button>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-5 rounded-2xl text-xl font-semibold"
            >
              Generate Audit
            </button>
          </div>
        </form>

        {auditResult && (
          <div className="mt-12 bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-4xl font-bold mb-8">
              Audit Results
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-black p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-gray-400 mb-2">
                  Monthly Savings
                </h3>

                <p className="text-5xl font-bold text-green-400">
                  ${auditResult.monthlySavings}
                </p>
              </div>

              <div className="bg-black p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-gray-400 mb-2">
                  Annual Savings
                </h3>

                <p className="text-5xl font-bold text-green-400">
                  ${auditResult.annualSavings}
                </p>
              </div>
            </div>

            <div className="bg-black p-6 rounded-2xl border border-zinc-800 mb-6">
              <h3 className="text-2xl font-semibold mb-4">
                Recommendations
              </h3>

              {auditResult.recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {auditResult.recommendations.map(
                    (rec, index) => (
                      <li
                        key={index}
                        className="text-gray-300"
                      >
                        • {rec}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-gray-400">
                  Your setup already looks optimized.
                </p>
              )}
            </div>

            <div className="bg-black p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-2xl font-semibold mb-4">
                AI Summary
              </h3>

              <p className="text-gray-300 leading-7">
                {auditResult.aiSummary}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
