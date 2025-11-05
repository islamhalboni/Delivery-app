export const COLORS = {
    primary:      "#efc023",
    primaryDark:  "#f5f5f5",
    accent:       "#fc5600",

    white:        "#ffffff",
    black:        "#000000",
    text:         "#333333",
    mutedText:    "#999999",

    bgDefault:    "#FDFDFD",
    bgLight:      "#F1F1F1",

    borderLight:  "#E0E0E0",
    borderCard:   "#fff2e1",

    shadow:       "rgba(199,199,199,0.91)",
};

export const RADIUS = {
    xs: 3,
    sm: 5,
    md: 8,
    lg: 12,
    xl: 20, // 🆕 for round buttons or modals
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48, // 🆕 for more vertical spacing
};

export const SIZES = {
    logo:        300,
    inputHeight: 48,
    buttonHeight: 48, // 🆕 commonly used height for buttons
    iconMargin:  8,
    iconSize:    20,   // 🆕 for uniform icon sizing
};

export const FONTS = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 16,
  xl: 20,
  title: 22,
  family: {
    regular: "TajawalRegular",
    bold: "TajawalBold",
  },
};


export const SHADOWS = {
    card: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    button: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
};

export const theme = {
    COLORS,
    RADIUS,
    SPACING,
    SIZES,
    FONTS,
    SHADOWS,
};
