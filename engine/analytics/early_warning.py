from typing import Dict, Any, List

class EarlyWarningRadar:
    """
    Deterministic 5-State Early Warning Radar State Machine with actionable planning advice.
    """

    STATE_CRITICAL_SHORTAGE = "CRITICAL_SHORTAGE_RISK"
    STATE_EMERGING_SHORTAGE = "EMERGING_SHORTAGE"
    STATE_BALANCED = "BALANCED_EQUILIBRIUM"
    STATE_MODERATE_SATURATION = "MODERATE_SATURATION"
    STATE_SEVERE_OVERSUPPLY = "SEVERE_OVERSUPPLY_RISK"
    STATE_DATA_SPARSE = "LOW_CONFIDENCE_DATA_SPARSE"

    def classify(
        self,
        absolute_gap: int,
        tension_ratio: float,
        confidence_score: float = 0.85,
        growth_rate_pct: float = 0.0,
        is_sparse: bool = False
    ) -> Dict[str, Any]:
        """
        Classifies risk state and generates policy recommendations.
        """
        if is_sparse or confidence_score < 0.50:
            return {
                "flag_code": self.STATE_DATA_SPARSE,
                "label": "Low Confidence / Data Sparse",
                "label_hi": "कम विश्वास / विरल डेटा",
                "badge_color": "#757575",
                "badge_icon": "circle-question",
                "severity_rank": 4,
                "urgency": "Review Required",
                "recommended_action": "Initiate local employer cluster survey before approving seat allocations.",
                "action_hi": "सीट आवंटन स्वीकृत करने से पहले स्थानीय नियोक्ता क्लस्टर सर्वेक्षण शुरू करें।"
            }

        if tension_ratio >= 1.75 and absolute_gap >= 100:
            return {
                "flag_code": self.STATE_CRITICAL_SHORTAGE,
                "label": "Critical Shortage Risk",
                "label_hi": "गंभीर कमी जोखिम",
                "badge_color": "#D32F2F",
                "badge_icon": "hexagon-exclamation",
                "severity_rank": 1,
                "urgency": "Immediate Strategic Intervention",
                "recommended_action": "Sanction additional training batches, accredit new private/public centers, and fast-track RPL.",
                "action_hi": "अतिरिक्त प्रशिक्षण बैच स्वीकृत करें, नए केंद्र मान्यता प्राप्त करें और आरपीएल को गति दें।"
            }
        elif tension_ratio >= 1.25 or (tension_ratio >= 1.75 and absolute_gap < 100):
            return {
                "flag_code": self.STATE_EMERGING_SHORTAGE,
                "label": "Emerging Shortage",
                "label_hi": "उभरती हुई कमी",
                "badge_color": "#F57C00",
                "badge_icon": "triangle-exclamation",
                "severity_rank": 2,
                "urgency": "Proactive Capacity Review",
                "recommended_action": "Alert District Skill Committee to prepare expansion contingency for next intake cycle.",
                "action_hi": "जिला कौशल समिति को अगले प्रवेश चक्र के लिए विस्तार योजना तैयार करने के लिए सचेत करें।"
            }
        elif 0.80 <= tension_ratio <= 1.25:
            return {
                "flag_code": self.STATE_BALANCED,
                "label": "Balanced Equilibrium",
                "label_hi": "संतुलित स्थिति",
                "badge_color": "#388E3C",
                "badge_icon": "circle-check",
                "severity_rank": 5,
                "urgency": "Healthy Operations",
                "recommended_action": "Maintain sanctioned seat quotas; focus on curriculum quality, trainer pedagogy, and assessment rigor.",
                "action_hi": "स्वीकृत सीट कोटा बनाए रखें; पाठ्यक्रम की गुणवत्ता और मूल्यांकन पर ध्यान दें।"
            }
        elif 0.50 <= tension_ratio < 0.80:
            return {
                "flag_code": self.STATE_MODERATE_SATURATION,
                "label": "Moderate Saturation",
                "label_hi": "मध्यम संतृप्ति",
                "badge_color": "#1976D2",
                "badge_icon": "diamond-exclamation",
                "severity_rank": 3,
                "urgency": "Monitor Placement Drag",
                "recommended_action": "Freeze seat expansions; introduce cross-skilling or dual-specialization modules to preserve placement rates.",
                "action_hi": "सीट विस्तार पर रोक लगाएं; प्लेसमेंट दर बनाए रखने के लिए क्रॉस-स्किलिंग मॉड्यूल जोड़ें।"
            }
        else: # tension_ratio < 0.50 and absolute_gap <= -100
            return {
                "flag_code": self.STATE_SEVERE_OVERSUPPLY,
                "label": "Severe Oversupply Risk",
                "label_hi": "अत्यधिक अधिशेष जोखिम",
                "badge_color": "#7B1FA2",
                "badge_icon": "square-xmark",
                "severity_rank": 1,
                "urgency": "Urgent Seat Downscaling",
                "recommended_action": "Downscale sanctioned seats by 30-50%; reallocate infrastructure and trainers to adjacent shortage trades.",
                "action_hi": "स्वीकृत सीटों में 30-50% की कटौती करें; संसाधनों को नजदीकी कमी वाले ट्रेड्स में पुनः आवंटित करें।"
            }

early_warning_radar = EarlyWarningRadar()
