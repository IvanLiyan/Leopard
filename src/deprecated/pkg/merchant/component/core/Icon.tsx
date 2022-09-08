/*
 * Icon.tsx
 *
 * Created by Jonah Dlin on Fri Jun 25 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { SVGProps } from "react";

/* Zeus */
import {
  Icon as IconZ,
  IconProps as IconZProps,
  IconName,
} from "@ContextLogic/zeus";
import { useTheme } from "@stores/ThemeStore";
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type IconProps = BaseProps &
  Omit<
    SVGProps<SVGSVGElement>,
    "color" | "className" | "style" | "name" | "children"
  > & {
    readonly name: IconName;
    readonly color?: string | null | undefined;
    readonly size?: IconZProps["size"];
  };

const Icon: React.FC<IconProps> = (props: IconProps) => {
  const { textBlack } = useTheme();
  const {
    name,
    className,
    style,
    size,
    color: propsColor,
    ...otherProps
  } = props;

  const color = propsColor == null ? textBlack : propsColor;

  const IconMap: { readonly [name in IconName]: JSX.Element } = {
    activity: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="activity"
        colors={{ color1: color }}
      />
    ),
    airplane: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="airplane"
        colors={{ color1: color }}
      />
    ),
    airplaneMode: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="airplaneMode"
        colors={{ color1: color }}
      />
    ),
    arrange: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrange"
        colors={{ color1: color }}
      />
    ),
    arrowDown: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrowDown"
        colors={{ color1: color }}
      />
    ),
    arrowDownCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrowDownCircle"
        colors={{ color1: color }}
      />
    ),
    arrowLeft: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrowLeft"
        colors={{ color1: color }}
      />
    ),
    arrowLeftCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrowLeftCircle"
        colors={{ color1: color }}
      />
    ),
    arrowRight: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrowRight"
        colors={{ color1: color }}
      />
    ),
    arrowRightCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrowRightCircle"
        colors={{ color1: color }}
      />
    ),
    arrowUp: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrowUp"
        colors={{ color1: color }}
      />
    ),
    arrowUpCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="arrowUpCircle"
        colors={{ color1: color }}
      />
    ),
    assignmentCheck: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="assignmentCheck"
        colors={{ color1: color }}
      />
    ),
    bag: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="bag"
        colors={{ color1: color }}
      />
    ),
    bandage: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="bandage"
        colors={{ color1: color }}
      />
    ),
    barChart: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="barChart"
        colors={{ color1: color }}
      />
    ),
    barcode: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="barcode"
        colors={{ color1: color }}
      />
    ),
    bell: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="bell"
        colors={{ color1: color }}
      />
    ),
    bellCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="bellCircle"
        colors={{ color1: color }}
      />
    ),
    bookmark: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="bookmark"
        colors={{ color1: color }}
      />
    ),
    bookmarkFilled: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="bookmarkFilled"
        colors={{ color1: color }}
      />
    ),
    box: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="box"
        colors={{ color1: color }}
      />
    ),
    bullhorn: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="bullhorn"
        colors={{ color1: color }}
      />
    ),
    calculator: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="calculator"
        colors={{ color1: color }}
      />
    ),
    calendar: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="calendar"
        colors={{ color1: color }}
      />
    ),
    camera: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="camera"
        colors={{ color1: color }}
      />
    ),
    cameraPlus: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="cameraPlus"
        colors={{ color1: color }}
      />
    ),
    card: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="card"
        colors={{ color1: color }}
      />
    ),
    categories: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="categories"
        colors={{ color1: color }}
      />
    ),
    check: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="check"
        colors={{ color1: color }}
      />
    ),
    checkCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="checkCircle"
        colors={{ color1: color }}
      />
    ),
    chevronDownLarge: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="chevronDownLarge"
        colors={{ color1: color }}
      />
    ),
    chevronDownSmall: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="chevronDownSmall"
        colors={{ color1: color }}
      />
    ),
    chevronLeftLarge: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="chevronLeftLarge"
        colors={{ color1: color }}
      />
    ),
    chevronLeftSmall: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="chevronLeftSmall"
        colors={{ color1: color }}
      />
    ),
    chevronRightLarge: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="chevronRightLarge"
        colors={{ color1: color }}
      />
    ),
    chevronRightSmall: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="chevronRightSmall"
        colors={{ color1: color }}
      />
    ),
    chevronUpLarge: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="chevronUpLarge"
        colors={{ color1: color }}
      />
    ),
    chevronUpSmall: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="chevronUpSmall"
        colors={{ color1: color }}
      />
    ),
    class: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="class"
        colors={{ color1: color }}
      />
    ),
    clipboardCheck: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="clipboardCheck"
        colors={{ color1: color }}
      />
    ),
    clock: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="clock"
        colors={{ color1: color }}
      />
    ),
    combine: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="combine"
        colors={{ color1: color }}
      />
    ),
    comment: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="comment"
        colors={{ color1: color }}
      />
    ),
    compare: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="compare"
        colors={{ color1: color }}
      />
    ),
    confirmedDelivery: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="confirmedDelivery"
        colors={{ color1: color }}
      />
    ),
    confirmedDelivery2: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="confirmedDelivery2"
        colors={{ color1: color }}
      />
    ),
    contacts: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="contacts"
        colors={{ color1: color }}
      />
    ),
    copy: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="copy"
        colors={{ color1: color }}
      />
    ),
    desktop: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="desktop"
        colors={{ color1: color }}
      />
    ),
    disable: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="disable"
        colors={{ color1: color }}
      />
    ),
    dispute: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="dispute"
        colors={{ color1: color }}
      />
    ),
    doc: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="doc"
        colors={{ color1: color }}
      />
    ),
    docAlt: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="docAlt"
        colors={{ color1: color }}
      />
    ),
    dollar: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="dollar"
        colors={{ color1: color }}
      />
    ),
    doubleLeft: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="doubleLeft"
        colors={{ color1: color }}
      />
    ),
    doubleRight: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="doubleRight"
        colors={{ color1: color }}
      />
    ),
    download: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="download"
        colors={{ color1: color }}
      />
    ),
    edit: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="edit"
        colors={{ color1: color }}
      />
    ),
    enter: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="enter"
        colors={{ color1: color }}
      />
    ),
    error: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="error"
        colors={{ color1: color }}
      />
    ),
    explore: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="explore"
        colors={{ color1: color }}
      />
    ),
    extension: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="extension"
        colors={{ color1: color }}
      />
    ),
    externalLink: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="externalLink"
        colors={{ color1: color }}
      />
    ),
    eyeOff: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="eyeOff"
        colors={{ color1: color }}
      />
    ),
    eyeOn: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="eyeOn"
        colors={{ color1: color }}
      />
    ),
    file: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="file"
        colors={{ color1: color }}
      />
    ),
    filter: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="filter"
        colors={{ color1: color }}
      />
    ),
    fire: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="fire"
        colors={{ color1: color }}
      />
    ),
    firstlook: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="firstlook"
        colors={{ color1: color }}
      />
    ),
    flightLand: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="flightLand"
        colors={{ color1: color }}
      />
    ),
    flightTakeoff: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="flightTakeoff"
        colors={{ color1: color }}
      />
    ),
    folder: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="folder"
        colors={{ color1: color }}
      />
    ),
    gavel: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="gavel"
        colors={{ color1: color }}
      />
    ),
    gear: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="gear"
        colors={{ color1: color }}
      />
    ),
    gift: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="gift"
        colors={{ color1: color }}
      />
    ),
    globalLookup: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="globalLookup"
        colors={{ color1: color }}
      />
    ),
    globe: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="globe"
        colors={{ color1: color }}
      />
    ),
    group: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="group"
        colors={{ color1: color }}
      />
    ),
    groupJoin: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="groupJoin"
        colors={{ color1: color }}
      />
    ),
    halfStar: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="halfStar"
        colors={{ color1: color }}
      />
    ),
    hammerWrench: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="hammerWrench"
        colors={{ color1: color }}
      />
    ),
    heart: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="heart"
        colors={{ color1: color }}
      />
    ),
    heartFilled: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="heartFilled"
        colors={{ color1: color }}
      />
    ),
    help: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="help"
        colors={{ color1: color }}
      />
    ),
    history: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="history"
        colors={{ color1: color }}
      />
    ),
    home: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="home"
        colors={{ color1: color }}
      />
    ),
    hourglass: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="hourglass"
        colors={{ color1: color }}
      />
    ),
    image: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="image"
        colors={{ color1: color }}
      />
    ),
    inbound: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="inbound"
        colors={{ color1: color }}
      />
    ),
    inbox: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="inbox"
        colors={{ color1: color }}
      />
    ),
    inbox2: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="inbox2"
        colors={{ color1: color }}
      />
    ),
    increaseDecrease: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="increaseDecrease"
        colors={{ color1: color }}
      />
    ),
    info: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="info"
        colors={{ color1: color }}
      />
    ),
    inventory: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="inventory"
        colors={{ color1: color }}
      />
    ),
    inventory2: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="inventory2"
        colors={{ color1: color }}
      />
    ),
    inventory3: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="inventory3"
        colors={{ color1: color }}
      />
    ),
    inventory4: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="inventory4"
        colors={{ color1: color }}
      />
    ),
    legal: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="legal"
        colors={{ color1: color }}
      />
    ),
    lifesaver: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="lifesaver"
        colors={{ color1: color }}
      />
    ),
    link: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="link"
        colors={{ color1: color }}
      />
    ),
    listView: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="listView"
        colors={{ color1: color }}
      />
    ),
    lock: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="lock"
        colors={{ color1: color }}
      />
    ),
    logOut: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="logOut"
        colors={{ color1: color }}
      />
    ),
    login: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="login"
        colors={{ color1: color }}
      />
    ),
    mail: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="mail"
        colors={{ color1: color }}
      />
    ),
    management: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="management"
        colors={{ color1: color }}
      />
    ),
    manual: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="manual"
        colors={{ color1: color }}
      />
    ),
    mapPin: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="mapPin"
        colors={{ color1: color }}
      />
    ),
    maximize: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="maximize"
        colors={{ color1: color }}
      />
    ),
    measure: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="measure"
        colors={{ color1: color }}
      />
    ),
    mention: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="mention"
        colors={{ color1: color }}
      />
    ),
    menu: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="menu"
        colors={{ color1: color }}
      />
    ),
    minimize: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="minimize"
        colors={{ color1: color }}
      />
    ),
    minus: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="minus"
        colors={{ color1: color }}
      />
    ),
    minusCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="minusCircle"
        colors={{ color1: color }}
      />
    ),
    moreHorizontal: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="moreHorizontal"
        colors={{ color1: color }}
      />
    ),
    moreVertical: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="moreVertical"
        colors={{ color1: color }}
      />
    ),
    nearMe: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="nearMe"
        colors={{ color1: color }}
      />
    ),
    newBox: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="newBox"
        colors={{ color1: color }}
      />
    ),
    outbound: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="outbound"
        colors={{ color1: color }}
      />
    ),
    paperclip: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="paperclip"
        colors={{ color1: color }}
      />
    ),
    pause: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="pause"
        colors={{ color1: color }}
      />
    ),
    pauseCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="pauseCircle"
        colors={{ color1: color }}
      />
    ),
    phone: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="phone"
        colors={{ color1: color }}
      />
    ),
    photo: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="photo"
        colors={{ color1: color }}
      />
    ),
    play: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="play"
        colors={{ color1: color }}
      />
    ),
    playCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="playCircle"
        colors={{ color1: color }}
      />
    ),
    playlistAdd: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="playlistAdd"
        colors={{ color1: color }}
      />
    ),
    plus: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="plus"
        colors={{ color1: color }}
      />
    ),
    plusCircle: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="plusCircle"
        colors={{ color1: color }}
      />
    ),
    power: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="power"
        colors={{ color1: color }}
      />
    ),
    printer: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="printer"
        colors={{ color1: color }}
      />
    ),
    productBoost: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="productBoost"
        colors={{ color1: color }}
      />
    ),
    receipt: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="receipt"
        colors={{ color1: color }}
      />
    ),
    redo: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="redo"
        colors={{ color1: color }}
      />
    ),
    refresh: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="refresh"
        colors={{ color1: color }}
      />
    ),
    replay: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="replay"
        colors={{ color1: color }}
      />
    ),
    return: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="return"
        colors={{ color1: color }}
      />
    ),
    rewards: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="rewards"
        colors={{ color1: color }}
      />
    ),
    rewardsFilled: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="rewardsFilled"
        colors={{ color1: color }}
      />
    ),
    save: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="save"
        colors={{ color1: color }}
      />
    ),
    scan: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="scan"
        colors={{ color1: color }}
      />
    ),
    search: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="search"
        colors={{ color1: color }}
      />
    ),
    send: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="send"
        colors={{ color1: color }}
      />
    ),
    settings: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="settings"
        colors={{ color1: color }}
      />
    ),
    share: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="share"
        colors={{ color1: color }}
      />
    ),
    shareIos: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="shareIos"
        colors={{ color1: color }}
      />
    ),
    shield: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="shield"
        colors={{ color1: color }}
      />
    ),
    shieldCheck: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="shieldCheck"
        colors={{ color1: color }}
      />
    ),
    shieldLock: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="shieldLock"
        colors={{ color1: color }}
      />
    ),
    shieldUser: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="shieldUser"
        colors={{ color1: color }}
      />
    ),
    ship: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="ship"
        colors={{ color1: color }}
      />
    ),
    shoppingCart: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="shoppingCart"
        colors={{ color1: color }}
      />
    ),
    shoppingCartArrow: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="shoppingCartArrow"
        colors={{ color1: color }}
      />
    ),
    shoppingCartPlus: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="shoppingCartPlus"
        colors={{ color1: color }}
      />
    ),
    showroom: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="showroom"
        colors={{ color1: color }}
      />
    ),
    smartphone: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="smartphone"
        colors={{ color1: color }}
      />
    ),
    sort: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="sort"
        colors={{ color1: color }}
      />
    ),
    star: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="star"
        colors={{ color1: color }}
      />
    ),
    starFilled: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="starFilled"
        colors={{ color1: color }}
      />
    ),
    store: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="store"
        colors={{ color1: color }}
      />
    ),
    tag: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="tag"
        colors={{ color1: color }}
      />
    ),
    target: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="target"
        colors={{ color1: color }}
      />
    ),
    thumbsDown: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="thumbsDown"
        colors={{ color1: color }}
      />
    ),
    thumbsDownFilled: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="thumbsDownFilled"
        colors={{ color1: color }}
      />
    ),
    thumbsUp: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="thumbsUp"
        colors={{ color1: color }}
      />
    ),
    thumbsUpFilled: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="thumbsUpFilled"
        colors={{ color1: color }}
      />
    ),
    ticket: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="ticket"
        colors={{ color1: color }}
      />
    ),
    tip: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="tip"
        colors={{ color1: color }}
      />
    ),
    trackShipment: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="trackShipment"
        colors={{ color1: color }}
      />
    ),
    tracking: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="tracking"
        colors={{ color1: color }}
      />
    ),
    transfer: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="transfer"
        colors={{ color1: color }}
      />
    ),
    trash: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="trash"
        colors={{ color1: color }}
      />
    ),
    truck: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="truck"
        colors={{ color1: color }}
      />
    ),
    undo: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="undo"
        colors={{ color1: color }}
      />
    ),
    unlock: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="unlock"
        colors={{ color1: color }}
      />
    ),
    uploadCloud: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="uploadCloud"
        colors={{ color1: color }}
      />
    ),
    user: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="user"
        colors={{ color1: color }}
      />
    ),
    userCheck: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="userCheck"
        colors={{ color1: color }}
      />
    ),
    userDisabled: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="userDisabled"
        colors={{ color1: color }}
      />
    ),
    userGear: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="userGear"
        colors={{ color1: color }}
      />
    ),
    userPlus: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="userPlus"
        colors={{ color1: color }}
      />
    ),
    volume: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="volume"
        colors={{ color1: color }}
      />
    ),
    volumeX: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="volumeX"
        colors={{ color1: color }}
      />
    ),
    wallet: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="wallet"
        colors={{ color1: color }}
      />
    ),
    warehouse: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="warehouse"
        colors={{ color1: color }}
      />
    ),
    warning: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="warning"
        colors={{ color1: color }}
      />
    ),
    weight: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="weight"
        colors={{ color1: color }}
      />
    ),
    x: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="x"
        colors={{ color1: color }}
      />
    ),
    zoomIn: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="zoomIn"
        colors={{ color1: color }}
      />
    ),
    zoomOut: (
      <IconZ
        className={css(className, style)}
        size={size}
        {...otherProps}
        name="zoomOut"
        colors={{ color1: color }}
      />
    ),
  };

  return IconMap[name] || null;
};

export default Icon;
