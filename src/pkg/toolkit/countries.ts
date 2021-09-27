//
//  toolkit/countries.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable filenames/match-exported */
import { CountryCode } from "@schema/types";

import globalFlag1x1 from "@assets/img/flags/1x1/d.svg";
import adFlag1x1 from "@assets/img/flags/1x1/ad.svg";
import aeFlag1x1 from "@assets/img/flags/1x1/ae.svg";
import afFlag1x1 from "@assets/img/flags/1x1/af.svg";
import agFlag1x1 from "@assets/img/flags/1x1/ag.svg";
import aiFlag1x1 from "@assets/img/flags/1x1/ai.svg";
import alFlag1x1 from "@assets/img/flags/1x1/al.svg";
import amFlag1x1 from "@assets/img/flags/1x1/am.svg";
import aoFlag1x1 from "@assets/img/flags/1x1/ao.svg";
import aqFlag1x1 from "@assets/img/flags/1x1/aq.svg";
import arFlag1x1 from "@assets/img/flags/1x1/ar.svg";
import asFlag1x1 from "@assets/img/flags/1x1/as.svg";
import atFlag1x1 from "@assets/img/flags/1x1/at.svg";
import auFlag1x1 from "@assets/img/flags/1x1/au.svg";
import awFlag1x1 from "@assets/img/flags/1x1/aw.svg";
import axFlag1x1 from "@assets/img/flags/1x1/ax.svg";
import azFlag1x1 from "@assets/img/flags/1x1/az.svg";
import baFlag1x1 from "@assets/img/flags/1x1/ba.svg";
import bbFlag1x1 from "@assets/img/flags/1x1/bb.svg";
import bdFlag1x1 from "@assets/img/flags/1x1/bd.svg";
import beFlag1x1 from "@assets/img/flags/1x1/be.svg";
import bfFlag1x1 from "@assets/img/flags/1x1/bf.svg";
import bgFlag1x1 from "@assets/img/flags/1x1/bg.svg";
import bhFlag1x1 from "@assets/img/flags/1x1/bh.svg";
import biFlag1x1 from "@assets/img/flags/1x1/bi.svg";
import bjFlag1x1 from "@assets/img/flags/1x1/bj.svg";
import blFlag1x1 from "@assets/img/flags/1x1/bl.svg";
import bmFlag1x1 from "@assets/img/flags/1x1/bm.svg";
import bnFlag1x1 from "@assets/img/flags/1x1/bn.svg";
import boFlag1x1 from "@assets/img/flags/1x1/bo.svg";
import bqFlag1x1 from "@assets/img/flags/1x1/bq.svg";
import brFlag1x1 from "@assets/img/flags/1x1/br.svg";
import bsFlag1x1 from "@assets/img/flags/1x1/bs.svg";
import btFlag1x1 from "@assets/img/flags/1x1/bt.svg";
import bvFlag1x1 from "@assets/img/flags/1x1/bv.svg";
import bwFlag1x1 from "@assets/img/flags/1x1/bw.svg";
import byFlag1x1 from "@assets/img/flags/1x1/by.svg";
import bzFlag1x1 from "@assets/img/flags/1x1/bz.svg";
import caFlag1x1 from "@assets/img/flags/1x1/ca.svg";
import ccFlag1x1 from "@assets/img/flags/1x1/cc.svg";
import cdFlag1x1 from "@assets/img/flags/1x1/cd.svg";
import cfFlag1x1 from "@assets/img/flags/1x1/cf.svg";
import cgFlag1x1 from "@assets/img/flags/1x1/cg.svg";
import chFlag1x1 from "@assets/img/flags/1x1/ch.svg";
import ciFlag1x1 from "@assets/img/flags/1x1/ci.svg";
import ckFlag1x1 from "@assets/img/flags/1x1/ck.svg";
import clFlag1x1 from "@assets/img/flags/1x1/cl.svg";
import cmFlag1x1 from "@assets/img/flags/1x1/cm.svg";
import cnFlag1x1 from "@assets/img/flags/1x1/cn.svg";
import coFlag1x1 from "@assets/img/flags/1x1/co.svg";
import crFlag1x1 from "@assets/img/flags/1x1/cr.svg";
import cuFlag1x1 from "@assets/img/flags/1x1/cu.svg";
import cvFlag1x1 from "@assets/img/flags/1x1/cv.svg";
import cwFlag1x1 from "@assets/img/flags/1x1/cw.svg";
import cxFlag1x1 from "@assets/img/flags/1x1/cx.svg";
import cyFlag1x1 from "@assets/img/flags/1x1/cy.svg";
import czFlag1x1 from "@assets/img/flags/1x1/cz.svg";
import deFlag1x1 from "@assets/img/flags/1x1/de.svg";
import djFlag1x1 from "@assets/img/flags/1x1/dj.svg";
import dkFlag1x1 from "@assets/img/flags/1x1/dk.svg";
import dmFlag1x1 from "@assets/img/flags/1x1/dm.svg";
import doFlag1x1 from "@assets/img/flags/1x1/do.svg";
import dzFlag1x1 from "@assets/img/flags/1x1/dz.svg";
import ecFlag1x1 from "@assets/img/flags/1x1/ec.svg";
import eeFlag1x1 from "@assets/img/flags/1x1/ee.svg";
import egFlag1x1 from "@assets/img/flags/1x1/eg.svg";
import ehFlag1x1 from "@assets/img/flags/1x1/eh.svg";
import erFlag1x1 from "@assets/img/flags/1x1/er.svg";
import esFlag1x1 from "@assets/img/flags/1x1/es.svg";
import etFlag1x1 from "@assets/img/flags/1x1/et.svg";
import euFlag1x1 from "@assets/img/flags/1x1/eu.svg";
import fiFlag1x1 from "@assets/img/flags/1x1/fi.svg";
import fjFlag1x1 from "@assets/img/flags/1x1/fj.svg";
import fkFlag1x1 from "@assets/img/flags/1x1/fk.svg";
import fmFlag1x1 from "@assets/img/flags/1x1/fm.svg";
import foFlag1x1 from "@assets/img/flags/1x1/fo.svg";
import frFlag1x1 from "@assets/img/flags/1x1/fr.svg";
import gaFlag1x1 from "@assets/img/flags/1x1/ga.svg";
import gbFlag1x1 from "@assets/img/flags/1x1/gb.svg";
import gdFlag1x1 from "@assets/img/flags/1x1/gd.svg";
import geFlag1x1 from "@assets/img/flags/1x1/ge.svg";
import gfFlag1x1 from "@assets/img/flags/1x1/gf.svg";
import ggFlag1x1 from "@assets/img/flags/1x1/gg.svg";
import ghFlag1x1 from "@assets/img/flags/1x1/gh.svg";
import giFlag1x1 from "@assets/img/flags/1x1/gi.svg";
import glFlag1x1 from "@assets/img/flags/1x1/gl.svg";
import gmFlag1x1 from "@assets/img/flags/1x1/gm.svg";
import gnFlag1x1 from "@assets/img/flags/1x1/gn.svg";
import gpFlag1x1 from "@assets/img/flags/1x1/gp.svg";
import gqFlag1x1 from "@assets/img/flags/1x1/gq.svg";
import grFlag1x1 from "@assets/img/flags/1x1/gr.svg";
import gsFlag1x1 from "@assets/img/flags/1x1/gs.svg";
import gtFlag1x1 from "@assets/img/flags/1x1/gt.svg";
import guFlag1x1 from "@assets/img/flags/1x1/gu.svg";
import gwFlag1x1 from "@assets/img/flags/1x1/gw.svg";
import gyFlag1x1 from "@assets/img/flags/1x1/gy.svg";
import hkFlag1x1 from "@assets/img/flags/1x1/hk.svg";
import hmFlag1x1 from "@assets/img/flags/1x1/hm.svg";
import hnFlag1x1 from "@assets/img/flags/1x1/hn.svg";
import hrFlag1x1 from "@assets/img/flags/1x1/hr.svg";
import htFlag1x1 from "@assets/img/flags/1x1/ht.svg";
import huFlag1x1 from "@assets/img/flags/1x1/hu.svg";
import idFlag1x1 from "@assets/img/flags/1x1/id.svg";
import ieFlag1x1 from "@assets/img/flags/1x1/ie.svg";
import ilFlag1x1 from "@assets/img/flags/1x1/il.svg";
import imFlag1x1 from "@assets/img/flags/1x1/im.svg";
import inFlag1x1 from "@assets/img/flags/1x1/in.svg";
import ioFlag1x1 from "@assets/img/flags/1x1/io.svg";
import iqFlag1x1 from "@assets/img/flags/1x1/iq.svg";
import irFlag1x1 from "@assets/img/flags/1x1/ir.svg";
import isFlag1x1 from "@assets/img/flags/1x1/is.svg";
import itFlag1x1 from "@assets/img/flags/1x1/it.svg";
import jeFlag1x1 from "@assets/img/flags/1x1/je.svg";
import jmFlag1x1 from "@assets/img/flags/1x1/jm.svg";
import joFlag1x1 from "@assets/img/flags/1x1/jo.svg";
import jpFlag1x1 from "@assets/img/flags/1x1/jp.svg";
import keFlag1x1 from "@assets/img/flags/1x1/ke.svg";
import kgFlag1x1 from "@assets/img/flags/1x1/kg.svg";
import khFlag1x1 from "@assets/img/flags/1x1/kh.svg";
import kiFlag1x1 from "@assets/img/flags/1x1/ki.svg";
import kmFlag1x1 from "@assets/img/flags/1x1/km.svg";
import knFlag1x1 from "@assets/img/flags/1x1/kn.svg";
import kpFlag1x1 from "@assets/img/flags/1x1/kp.svg";
import krFlag1x1 from "@assets/img/flags/1x1/kr.svg";
import kwFlag1x1 from "@assets/img/flags/1x1/kw.svg";
import kyFlag1x1 from "@assets/img/flags/1x1/ky.svg";
import kzFlag1x1 from "@assets/img/flags/1x1/kz.svg";
import laFlag1x1 from "@assets/img/flags/1x1/la.svg";
import lbFlag1x1 from "@assets/img/flags/1x1/lb.svg";
import lcFlag1x1 from "@assets/img/flags/1x1/lc.svg";
import liFlag1x1 from "@assets/img/flags/1x1/li.svg";
import lkFlag1x1 from "@assets/img/flags/1x1/lk.svg";
import lrFlag1x1 from "@assets/img/flags/1x1/lr.svg";
import lsFlag1x1 from "@assets/img/flags/1x1/ls.svg";
import ltFlag1x1 from "@assets/img/flags/1x1/lt.svg";
import luFlag1x1 from "@assets/img/flags/1x1/lu.svg";
import lvFlag1x1 from "@assets/img/flags/1x1/lv.svg";
import lyFlag1x1 from "@assets/img/flags/1x1/ly.svg";
import maFlag1x1 from "@assets/img/flags/1x1/ma.svg";
import mcFlag1x1 from "@assets/img/flags/1x1/mc.svg";
import mdFlag1x1 from "@assets/img/flags/1x1/md.svg";
import meFlag1x1 from "@assets/img/flags/1x1/me.svg";
import mfFlag1x1 from "@assets/img/flags/1x1/mf.svg";
import mgFlag1x1 from "@assets/img/flags/1x1/mg.svg";
import mhFlag1x1 from "@assets/img/flags/1x1/mh.svg";
import mkFlag1x1 from "@assets/img/flags/1x1/mk.svg";
import mlFlag1x1 from "@assets/img/flags/1x1/ml.svg";
import mmFlag1x1 from "@assets/img/flags/1x1/mm.svg";
import mnFlag1x1 from "@assets/img/flags/1x1/mn.svg";
import moFlag1x1 from "@assets/img/flags/1x1/mo.svg";
import mpFlag1x1 from "@assets/img/flags/1x1/mp.svg";
import mqFlag1x1 from "@assets/img/flags/1x1/mq.svg";
import mrFlag1x1 from "@assets/img/flags/1x1/mr.svg";
import msFlag1x1 from "@assets/img/flags/1x1/ms.svg";
import mtFlag1x1 from "@assets/img/flags/1x1/mt.svg";
import muFlag1x1 from "@assets/img/flags/1x1/mu.svg";
import mvFlag1x1 from "@assets/img/flags/1x1/mv.svg";
import mwFlag1x1 from "@assets/img/flags/1x1/mw.svg";
import mxFlag1x1 from "@assets/img/flags/1x1/mx.svg";
import myFlag1x1 from "@assets/img/flags/1x1/my.svg";
import mzFlag1x1 from "@assets/img/flags/1x1/mz.svg";
import naFlag1x1 from "@assets/img/flags/1x1/na.svg";
import ncFlag1x1 from "@assets/img/flags/1x1/nc.svg";
import neFlag1x1 from "@assets/img/flags/1x1/ne.svg";
import nfFlag1x1 from "@assets/img/flags/1x1/nf.svg";
import ngFlag1x1 from "@assets/img/flags/1x1/ng.svg";
import niFlag1x1 from "@assets/img/flags/1x1/ni.svg";
import nlFlag1x1 from "@assets/img/flags/1x1/nl.svg";
import noFlag1x1 from "@assets/img/flags/1x1/no.svg";
import npFlag1x1 from "@assets/img/flags/1x1/np.svg";
import nrFlag1x1 from "@assets/img/flags/1x1/nr.svg";
import nuFlag1x1 from "@assets/img/flags/1x1/nu.svg";
import nzFlag1x1 from "@assets/img/flags/1x1/nz.svg";
import omFlag1x1 from "@assets/img/flags/1x1/om.svg";
import paFlag1x1 from "@assets/img/flags/1x1/pa.svg";
import peFlag1x1 from "@assets/img/flags/1x1/pe.svg";
import pfFlag1x1 from "@assets/img/flags/1x1/pf.svg";
import pgFlag1x1 from "@assets/img/flags/1x1/pg.svg";
import phFlag1x1 from "@assets/img/flags/1x1/ph.svg";
import pkFlag1x1 from "@assets/img/flags/1x1/pk.svg";
import plFlag1x1 from "@assets/img/flags/1x1/pl.svg";
import pmFlag1x1 from "@assets/img/flags/1x1/pm.svg";
import pnFlag1x1 from "@assets/img/flags/1x1/pn.svg";
import prFlag1x1 from "@assets/img/flags/1x1/pr.svg";
import psFlag1x1 from "@assets/img/flags/1x1/ps.svg";
import ptFlag1x1 from "@assets/img/flags/1x1/pt.svg";
import pwFlag1x1 from "@assets/img/flags/1x1/pw.svg";
import pyFlag1x1 from "@assets/img/flags/1x1/py.svg";
import qaFlag1x1 from "@assets/img/flags/1x1/qa.svg";
import reFlag1x1 from "@assets/img/flags/1x1/re.svg";
import roFlag1x1 from "@assets/img/flags/1x1/ro.svg";
import rsFlag1x1 from "@assets/img/flags/1x1/rs.svg";
import ruFlag1x1 from "@assets/img/flags/1x1/ru.svg";
import rwFlag1x1 from "@assets/img/flags/1x1/rw.svg";
import saFlag1x1 from "@assets/img/flags/1x1/sa.svg";
import sbFlag1x1 from "@assets/img/flags/1x1/sb.svg";
import scFlag1x1 from "@assets/img/flags/1x1/sc.svg";
import sdFlag1x1 from "@assets/img/flags/1x1/sd.svg";
import seFlag1x1 from "@assets/img/flags/1x1/se.svg";
import sgFlag1x1 from "@assets/img/flags/1x1/sg.svg";
import shFlag1x1 from "@assets/img/flags/1x1/sh.svg";
import siFlag1x1 from "@assets/img/flags/1x1/si.svg";
import sjFlag1x1 from "@assets/img/flags/1x1/sj.svg";
import skFlag1x1 from "@assets/img/flags/1x1/sk.svg";
import slFlag1x1 from "@assets/img/flags/1x1/sl.svg";
import smFlag1x1 from "@assets/img/flags/1x1/sm.svg";
import snFlag1x1 from "@assets/img/flags/1x1/sn.svg";
import soFlag1x1 from "@assets/img/flags/1x1/so.svg";
import srFlag1x1 from "@assets/img/flags/1x1/sr.svg";
import ssFlag1x1 from "@assets/img/flags/1x1/ss.svg";
import stFlag1x1 from "@assets/img/flags/1x1/st.svg";
import svFlag1x1 from "@assets/img/flags/1x1/sv.svg";
import sxFlag1x1 from "@assets/img/flags/1x1/sx.svg";
import syFlag1x1 from "@assets/img/flags/1x1/sy.svg";
import szFlag1x1 from "@assets/img/flags/1x1/sz.svg";
import tcFlag1x1 from "@assets/img/flags/1x1/tc.svg";
import tdFlag1x1 from "@assets/img/flags/1x1/td.svg";
import tfFlag1x1 from "@assets/img/flags/1x1/tf.svg";
import tgFlag1x1 from "@assets/img/flags/1x1/tg.svg";
import thFlag1x1 from "@assets/img/flags/1x1/th.svg";
import tjFlag1x1 from "@assets/img/flags/1x1/tj.svg";
import tkFlag1x1 from "@assets/img/flags/1x1/tk.svg";
import tlFlag1x1 from "@assets/img/flags/1x1/tl.svg";
import tmFlag1x1 from "@assets/img/flags/1x1/tm.svg";
import tnFlag1x1 from "@assets/img/flags/1x1/tn.svg";
import toFlag1x1 from "@assets/img/flags/1x1/to.svg";
import trFlag1x1 from "@assets/img/flags/1x1/tr.svg";
import ttFlag1x1 from "@assets/img/flags/1x1/tt.svg";
import tvFlag1x1 from "@assets/img/flags/1x1/tv.svg";
import twFlag1x1 from "@assets/img/flags/1x1/tw.svg";
import tzFlag1x1 from "@assets/img/flags/1x1/tz.svg";
import uaFlag1x1 from "@assets/img/flags/1x1/ua.svg";
import ugFlag1x1 from "@assets/img/flags/1x1/ug.svg";
import umFlag1x1 from "@assets/img/flags/1x1/um.svg";
import unFlag1x1 from "@assets/img/flags/1x1/un.svg";
import usFlag1x1 from "@assets/img/flags/1x1/us.svg";
import uyFlag1x1 from "@assets/img/flags/1x1/uy.svg";
import uzFlag1x1 from "@assets/img/flags/1x1/uz.svg";
import vaFlag1x1 from "@assets/img/flags/1x1/va.svg";
import vcFlag1x1 from "@assets/img/flags/1x1/vc.svg";
import veFlag1x1 from "@assets/img/flags/1x1/ve.svg";
import vgFlag1x1 from "@assets/img/flags/1x1/vg.svg";
import viFlag1x1 from "@assets/img/flags/1x1/vi.svg";
import vnFlag1x1 from "@assets/img/flags/1x1/vn.svg";
import vuFlag1x1 from "@assets/img/flags/1x1/vu.svg";
import wfFlag1x1 from "@assets/img/flags/1x1/wf.svg";
import wsFlag1x1 from "@assets/img/flags/1x1/ws.svg";
import yeFlag1x1 from "@assets/img/flags/1x1/ye.svg";
import ytFlag1x1 from "@assets/img/flags/1x1/yt.svg";
import zaFlag1x1 from "@assets/img/flags/1x1/za.svg";
import zmFlag1x1 from "@assets/img/flags/1x1/zm.svg";
import zwFlag1x1 from "@assets/img/flags/1x1/zw.svg";
import globalFlag4x3 from "@assets/img/flags/4x3/d.svg";
import adFlag4x3 from "@assets/img/flags/4x3/ad.svg";
import aeFlag4x3 from "@assets/img/flags/4x3/ae.svg";
import afFlag4x3 from "@assets/img/flags/4x3/af.svg";
import agFlag4x3 from "@assets/img/flags/4x3/ag.svg";
import aiFlag4x3 from "@assets/img/flags/4x3/ai.svg";
import alFlag4x3 from "@assets/img/flags/4x3/al.svg";
import amFlag4x3 from "@assets/img/flags/4x3/am.svg";
import aoFlag4x3 from "@assets/img/flags/4x3/ao.svg";
import aqFlag4x3 from "@assets/img/flags/4x3/aq.svg";
import arFlag4x3 from "@assets/img/flags/4x3/ar.svg";
import asFlag4x3 from "@assets/img/flags/4x3/as.svg";
import atFlag4x3 from "@assets/img/flags/4x3/at.svg";
import auFlag4x3 from "@assets/img/flags/4x3/au.svg";
import awFlag4x3 from "@assets/img/flags/4x3/aw.svg";
import axFlag4x3 from "@assets/img/flags/4x3/ax.svg";
import azFlag4x3 from "@assets/img/flags/4x3/az.svg";
import baFlag4x3 from "@assets/img/flags/4x3/ba.svg";
import bbFlag4x3 from "@assets/img/flags/4x3/bb.svg";
import bdFlag4x3 from "@assets/img/flags/4x3/bd.svg";
import beFlag4x3 from "@assets/img/flags/4x3/be.svg";
import bfFlag4x3 from "@assets/img/flags/4x3/bf.svg";
import bgFlag4x3 from "@assets/img/flags/4x3/bg.svg";
import bhFlag4x3 from "@assets/img/flags/4x3/bh.svg";
import biFlag4x3 from "@assets/img/flags/4x3/bi.svg";
import bjFlag4x3 from "@assets/img/flags/4x3/bj.svg";
import blFlag4x3 from "@assets/img/flags/4x3/bl.svg";
import bmFlag4x3 from "@assets/img/flags/4x3/bm.svg";
import bnFlag4x3 from "@assets/img/flags/4x3/bn.svg";
import boFlag4x3 from "@assets/img/flags/4x3/bo.svg";
import bqFlag4x3 from "@assets/img/flags/4x3/bq.svg";
import brFlag4x3 from "@assets/img/flags/4x3/br.svg";
import bsFlag4x3 from "@assets/img/flags/4x3/bs.svg";
import btFlag4x3 from "@assets/img/flags/4x3/bt.svg";
import bvFlag4x3 from "@assets/img/flags/4x3/bv.svg";
import bwFlag4x3 from "@assets/img/flags/4x3/bw.svg";
import byFlag4x3 from "@assets/img/flags/4x3/by.svg";
import bzFlag4x3 from "@assets/img/flags/4x3/bz.svg";
import caFlag4x3 from "@assets/img/flags/4x3/ca.svg";
import ccFlag4x3 from "@assets/img/flags/4x3/cc.svg";
import cdFlag4x3 from "@assets/img/flags/4x3/cd.svg";
import cfFlag4x3 from "@assets/img/flags/4x3/cf.svg";
import cgFlag4x3 from "@assets/img/flags/4x3/cg.svg";
import chFlag4x3 from "@assets/img/flags/4x3/ch.svg";
import ciFlag4x3 from "@assets/img/flags/4x3/ci.svg";
import ckFlag4x3 from "@assets/img/flags/4x3/ck.svg";
import clFlag4x3 from "@assets/img/flags/4x3/cl.svg";
import cmFlag4x3 from "@assets/img/flags/4x3/cm.svg";
import cnFlag4x3 from "@assets/img/flags/4x3/cn.svg";
import coFlag4x3 from "@assets/img/flags/4x3/co.svg";
import crFlag4x3 from "@assets/img/flags/4x3/cr.svg";
import cuFlag4x3 from "@assets/img/flags/4x3/cu.svg";
import cvFlag4x3 from "@assets/img/flags/4x3/cv.svg";
import cwFlag4x3 from "@assets/img/flags/4x3/cw.svg";
import cxFlag4x3 from "@assets/img/flags/4x3/cx.svg";
import cyFlag4x3 from "@assets/img/flags/4x3/cy.svg";
import czFlag4x3 from "@assets/img/flags/4x3/cz.svg";
import deFlag4x3 from "@assets/img/flags/4x3/de.svg";
import djFlag4x3 from "@assets/img/flags/4x3/dj.svg";
import dkFlag4x3 from "@assets/img/flags/4x3/dk.svg";
import dmFlag4x3 from "@assets/img/flags/4x3/dm.svg";
import doFlag4x3 from "@assets/img/flags/4x3/do.svg";
import dzFlag4x3 from "@assets/img/flags/4x3/dz.svg";
import ecFlag4x3 from "@assets/img/flags/4x3/ec.svg";
import eeFlag4x3 from "@assets/img/flags/4x3/ee.svg";
import egFlag4x3 from "@assets/img/flags/4x3/eg.svg";
import ehFlag4x3 from "@assets/img/flags/4x3/eh.svg";
import erFlag4x3 from "@assets/img/flags/4x3/er.svg";
import esFlag4x3 from "@assets/img/flags/4x3/es.svg";
import etFlag4x3 from "@assets/img/flags/4x3/et.svg";
import euFlag4x3 from "@assets/img/flags/4x3/eu.svg";
import fiFlag4x3 from "@assets/img/flags/4x3/fi.svg";
import fjFlag4x3 from "@assets/img/flags/4x3/fj.svg";
import fkFlag4x3 from "@assets/img/flags/4x3/fk.svg";
import fmFlag4x3 from "@assets/img/flags/4x3/fm.svg";
import foFlag4x3 from "@assets/img/flags/4x3/fo.svg";
import frFlag4x3 from "@assets/img/flags/4x3/fr.svg";
import gaFlag4x3 from "@assets/img/flags/4x3/ga.svg";
import gbFlag4x3 from "@assets/img/flags/4x3/gb.svg";
import gdFlag4x3 from "@assets/img/flags/4x3/gd.svg";
import geFlag4x3 from "@assets/img/flags/4x3/ge.svg";
import gfFlag4x3 from "@assets/img/flags/4x3/gf.svg";
import ggFlag4x3 from "@assets/img/flags/4x3/gg.svg";
import ghFlag4x3 from "@assets/img/flags/4x3/gh.svg";
import giFlag4x3 from "@assets/img/flags/4x3/gi.svg";
import glFlag4x3 from "@assets/img/flags/4x3/gl.svg";
import gmFlag4x3 from "@assets/img/flags/4x3/gm.svg";
import gnFlag4x3 from "@assets/img/flags/4x3/gn.svg";
import gpFlag4x3 from "@assets/img/flags/4x3/gp.svg";
import gqFlag4x3 from "@assets/img/flags/4x3/gq.svg";
import grFlag4x3 from "@assets/img/flags/4x3/gr.svg";
import gsFlag4x3 from "@assets/img/flags/4x3/gs.svg";
import gtFlag4x3 from "@assets/img/flags/4x3/gt.svg";
import guFlag4x3 from "@assets/img/flags/4x3/gu.svg";
import gwFlag4x3 from "@assets/img/flags/4x3/gw.svg";
import gyFlag4x3 from "@assets/img/flags/4x3/gy.svg";
import hkFlag4x3 from "@assets/img/flags/4x3/hk.svg";
import hmFlag4x3 from "@assets/img/flags/4x3/hm.svg";
import hnFlag4x3 from "@assets/img/flags/4x3/hn.svg";
import hrFlag4x3 from "@assets/img/flags/4x3/hr.svg";
import htFlag4x3 from "@assets/img/flags/4x3/ht.svg";
import huFlag4x3 from "@assets/img/flags/4x3/hu.svg";
import idFlag4x3 from "@assets/img/flags/4x3/id.svg";
import ieFlag4x3 from "@assets/img/flags/4x3/ie.svg";
import ilFlag4x3 from "@assets/img/flags/4x3/il.svg";
import imFlag4x3 from "@assets/img/flags/4x3/im.svg";
import inFlag4x3 from "@assets/img/flags/4x3/in.svg";
import ioFlag4x3 from "@assets/img/flags/4x3/io.svg";
import iqFlag4x3 from "@assets/img/flags/4x3/iq.svg";
import irFlag4x3 from "@assets/img/flags/4x3/ir.svg";
import isFlag4x3 from "@assets/img/flags/4x3/is.svg";
import itFlag4x3 from "@assets/img/flags/4x3/it.svg";
import jeFlag4x3 from "@assets/img/flags/4x3/je.svg";
import jmFlag4x3 from "@assets/img/flags/4x3/jm.svg";
import joFlag4x3 from "@assets/img/flags/4x3/jo.svg";
import jpFlag4x3 from "@assets/img/flags/4x3/jp.svg";
import keFlag4x3 from "@assets/img/flags/4x3/ke.svg";
import kgFlag4x3 from "@assets/img/flags/4x3/kg.svg";
import khFlag4x3 from "@assets/img/flags/4x3/kh.svg";
import kiFlag4x3 from "@assets/img/flags/4x3/ki.svg";
import kmFlag4x3 from "@assets/img/flags/4x3/km.svg";
import knFlag4x3 from "@assets/img/flags/4x3/kn.svg";
import kpFlag4x3 from "@assets/img/flags/4x3/kp.svg";
import krFlag4x3 from "@assets/img/flags/4x3/kr.svg";
import kwFlag4x3 from "@assets/img/flags/4x3/kw.svg";
import kyFlag4x3 from "@assets/img/flags/4x3/ky.svg";
import kzFlag4x3 from "@assets/img/flags/4x3/kz.svg";
import laFlag4x3 from "@assets/img/flags/4x3/la.svg";
import lbFlag4x3 from "@assets/img/flags/4x3/lb.svg";
import lcFlag4x3 from "@assets/img/flags/4x3/lc.svg";
import liFlag4x3 from "@assets/img/flags/4x3/li.svg";
import lkFlag4x3 from "@assets/img/flags/4x3/lk.svg";
import lrFlag4x3 from "@assets/img/flags/4x3/lr.svg";
import lsFlag4x3 from "@assets/img/flags/4x3/ls.svg";
import ltFlag4x3 from "@assets/img/flags/4x3/lt.svg";
import luFlag4x3 from "@assets/img/flags/4x3/lu.svg";
import lvFlag4x3 from "@assets/img/flags/4x3/lv.svg";
import lyFlag4x3 from "@assets/img/flags/4x3/ly.svg";
import maFlag4x3 from "@assets/img/flags/4x3/ma.svg";
import mcFlag4x3 from "@assets/img/flags/4x3/mc.svg";
import mdFlag4x3 from "@assets/img/flags/4x3/md.svg";
import meFlag4x3 from "@assets/img/flags/4x3/me.svg";
import mfFlag4x3 from "@assets/img/flags/4x3/mf.svg";
import mgFlag4x3 from "@assets/img/flags/4x3/mg.svg";
import mhFlag4x3 from "@assets/img/flags/4x3/mh.svg";
import mkFlag4x3 from "@assets/img/flags/4x3/mk.svg";
import mlFlag4x3 from "@assets/img/flags/4x3/ml.svg";
import mmFlag4x3 from "@assets/img/flags/4x3/mm.svg";
import mnFlag4x3 from "@assets/img/flags/4x3/mn.svg";
import moFlag4x3 from "@assets/img/flags/4x3/mo.svg";
import mpFlag4x3 from "@assets/img/flags/4x3/mp.svg";
import mqFlag4x3 from "@assets/img/flags/4x3/mq.svg";
import mrFlag4x3 from "@assets/img/flags/4x3/mr.svg";
import msFlag4x3 from "@assets/img/flags/4x3/ms.svg";
import mtFlag4x3 from "@assets/img/flags/4x3/mt.svg";
import muFlag4x3 from "@assets/img/flags/4x3/mu.svg";
import mvFlag4x3 from "@assets/img/flags/4x3/mv.svg";
import mwFlag4x3 from "@assets/img/flags/4x3/mw.svg";
import mxFlag4x3 from "@assets/img/flags/4x3/mx.svg";
import myFlag4x3 from "@assets/img/flags/4x3/my.svg";
import mzFlag4x3 from "@assets/img/flags/4x3/mz.svg";
import naFlag4x3 from "@assets/img/flags/4x3/na.svg";
import ncFlag4x3 from "@assets/img/flags/4x3/nc.svg";
import neFlag4x3 from "@assets/img/flags/4x3/ne.svg";
import nfFlag4x3 from "@assets/img/flags/4x3/nf.svg";
import ngFlag4x3 from "@assets/img/flags/4x3/ng.svg";
import niFlag4x3 from "@assets/img/flags/4x3/ni.svg";
import nlFlag4x3 from "@assets/img/flags/4x3/nl.svg";
import noFlag4x3 from "@assets/img/flags/4x3/no.svg";
import npFlag4x3 from "@assets/img/flags/4x3/np.svg";
import nrFlag4x3 from "@assets/img/flags/4x3/nr.svg";
import nuFlag4x3 from "@assets/img/flags/4x3/nu.svg";
import nzFlag4x3 from "@assets/img/flags/4x3/nz.svg";
import omFlag4x3 from "@assets/img/flags/4x3/om.svg";
import paFlag4x3 from "@assets/img/flags/4x3/pa.svg";
import peFlag4x3 from "@assets/img/flags/4x3/pe.svg";
import pfFlag4x3 from "@assets/img/flags/4x3/pf.svg";
import pgFlag4x3 from "@assets/img/flags/4x3/pg.svg";
import phFlag4x3 from "@assets/img/flags/4x3/ph.svg";
import pkFlag4x3 from "@assets/img/flags/4x3/pk.svg";
import plFlag4x3 from "@assets/img/flags/4x3/pl.svg";
import pmFlag4x3 from "@assets/img/flags/4x3/pm.svg";
import pnFlag4x3 from "@assets/img/flags/4x3/pn.svg";
import prFlag4x3 from "@assets/img/flags/4x3/pr.svg";
import psFlag4x3 from "@assets/img/flags/4x3/ps.svg";
import ptFlag4x3 from "@assets/img/flags/4x3/pt.svg";
import pwFlag4x3 from "@assets/img/flags/4x3/pw.svg";
import pyFlag4x3 from "@assets/img/flags/4x3/py.svg";
import qaFlag4x3 from "@assets/img/flags/4x3/qa.svg";
import reFlag4x3 from "@assets/img/flags/4x3/re.svg";
import roFlag4x3 from "@assets/img/flags/4x3/ro.svg";
import rsFlag4x3 from "@assets/img/flags/4x3/rs.svg";
import ruFlag4x3 from "@assets/img/flags/4x3/ru.svg";
import rwFlag4x3 from "@assets/img/flags/4x3/rw.svg";
import saFlag4x3 from "@assets/img/flags/4x3/sa.svg";
import sbFlag4x3 from "@assets/img/flags/4x3/sb.svg";
import scFlag4x3 from "@assets/img/flags/4x3/sc.svg";
import sdFlag4x3 from "@assets/img/flags/4x3/sd.svg";
import seFlag4x3 from "@assets/img/flags/4x3/se.svg";
import sgFlag4x3 from "@assets/img/flags/4x3/sg.svg";
import shFlag4x3 from "@assets/img/flags/4x3/sh.svg";
import siFlag4x3 from "@assets/img/flags/4x3/si.svg";
import sjFlag4x3 from "@assets/img/flags/4x3/sj.svg";
import skFlag4x3 from "@assets/img/flags/4x3/sk.svg";
import slFlag4x3 from "@assets/img/flags/4x3/sl.svg";
import smFlag4x3 from "@assets/img/flags/4x3/sm.svg";
import snFlag4x3 from "@assets/img/flags/4x3/sn.svg";
import soFlag4x3 from "@assets/img/flags/4x3/so.svg";
import srFlag4x3 from "@assets/img/flags/4x3/sr.svg";
import ssFlag4x3 from "@assets/img/flags/4x3/ss.svg";
import stFlag4x3 from "@assets/img/flags/4x3/st.svg";
import svFlag4x3 from "@assets/img/flags/4x3/sv.svg";
import sxFlag4x3 from "@assets/img/flags/4x3/sx.svg";
import syFlag4x3 from "@assets/img/flags/4x3/sy.svg";
import szFlag4x3 from "@assets/img/flags/4x3/sz.svg";
import tcFlag4x3 from "@assets/img/flags/4x3/tc.svg";
import tdFlag4x3 from "@assets/img/flags/4x3/td.svg";
import tfFlag4x3 from "@assets/img/flags/4x3/tf.svg";
import tgFlag4x3 from "@assets/img/flags/4x3/tg.svg";
import thFlag4x3 from "@assets/img/flags/4x3/th.svg";
import tjFlag4x3 from "@assets/img/flags/4x3/tj.svg";
import tkFlag4x3 from "@assets/img/flags/4x3/tk.svg";
import tlFlag4x3 from "@assets/img/flags/4x3/tl.svg";
import tmFlag4x3 from "@assets/img/flags/4x3/tm.svg";
import tnFlag4x3 from "@assets/img/flags/4x3/tn.svg";
import toFlag4x3 from "@assets/img/flags/4x3/to.svg";
import trFlag4x3 from "@assets/img/flags/4x3/tr.svg";
import ttFlag4x3 from "@assets/img/flags/4x3/tt.svg";
import tvFlag4x3 from "@assets/img/flags/4x3/tv.svg";
import twFlag4x3 from "@assets/img/flags/4x3/tw.svg";
import tzFlag4x3 from "@assets/img/flags/4x3/tz.svg";
import uaFlag4x3 from "@assets/img/flags/4x3/ua.svg";
import ugFlag4x3 from "@assets/img/flags/4x3/ug.svg";
import umFlag4x3 from "@assets/img/flags/4x3/um.svg";
import unFlag4x3 from "@assets/img/flags/4x3/un.svg";
import usFlag4x3 from "@assets/img/flags/4x3/us.svg";
import uyFlag4x3 from "@assets/img/flags/4x3/uy.svg";
import uzFlag4x3 from "@assets/img/flags/4x3/uz.svg";
import vaFlag4x3 from "@assets/img/flags/4x3/va.svg";
import vcFlag4x3 from "@assets/img/flags/4x3/vc.svg";
import veFlag4x3 from "@assets/img/flags/4x3/ve.svg";
import vgFlag4x3 from "@assets/img/flags/4x3/vg.svg";
import viFlag4x3 from "@assets/img/flags/4x3/vi.svg";
import vnFlag4x3 from "@assets/img/flags/4x3/vn.svg";
import vuFlag4x3 from "@assets/img/flags/4x3/vu.svg";
import wfFlag4x3 from "@assets/img/flags/4x3/wf.svg";
import wsFlag4x3 from "@assets/img/flags/4x3/ws.svg";
import yeFlag4x3 from "@assets/img/flags/4x3/ye.svg";
import ytFlag4x3 from "@assets/img/flags/4x3/yt.svg";
import zaFlag4x3 from "@assets/img/flags/4x3/za.svg";
import zmFlag4x3 from "@assets/img/flags/4x3/zm.svg";
import zwFlag4x3 from "@assets/img/flags/4x3/zw.svg";

export const Flags1x1: { [cc: string]: string } = {
  d: globalFlag1x1,
  ad: adFlag1x1,
  ae: aeFlag1x1,
  af: afFlag1x1,
  ag: agFlag1x1,
  ai: aiFlag1x1,
  al: alFlag1x1,
  am: amFlag1x1,
  ao: aoFlag1x1,
  aq: aqFlag1x1,
  ar: arFlag1x1,
  as: asFlag1x1,
  at: atFlag1x1,
  au: auFlag1x1,
  aw: awFlag1x1,
  ax: axFlag1x1,
  az: azFlag1x1,
  ba: baFlag1x1,
  bb: bbFlag1x1,
  bd: bdFlag1x1,
  be: beFlag1x1,
  bf: bfFlag1x1,
  bg: bgFlag1x1,
  bh: bhFlag1x1,
  bi: biFlag1x1,
  bj: bjFlag1x1,
  bl: blFlag1x1,
  bm: bmFlag1x1,
  bn: bnFlag1x1,
  bo: boFlag1x1,
  bq: bqFlag1x1,
  br: brFlag1x1,
  bs: bsFlag1x1,
  bt: btFlag1x1,
  bv: bvFlag1x1,
  bw: bwFlag1x1,
  by: byFlag1x1,
  bz: bzFlag1x1,
  ca: caFlag1x1,
  cc: ccFlag1x1,
  cd: cdFlag1x1,
  cf: cfFlag1x1,
  cg: cgFlag1x1,
  ch: chFlag1x1,
  ci: ciFlag1x1,
  ck: ckFlag1x1,
  cl: clFlag1x1,
  cm: cmFlag1x1,
  cn: cnFlag1x1,
  co: coFlag1x1,
  cr: crFlag1x1,
  cu: cuFlag1x1,
  cv: cvFlag1x1,
  cw: cwFlag1x1,
  cx: cxFlag1x1,
  cy: cyFlag1x1,
  cz: czFlag1x1,
  de: deFlag1x1,
  dj: djFlag1x1,
  dk: dkFlag1x1,
  dm: dmFlag1x1,
  do: doFlag1x1,
  dz: dzFlag1x1,
  ec: ecFlag1x1,
  ee: eeFlag1x1,
  eg: egFlag1x1,
  eh: ehFlag1x1,
  er: erFlag1x1,
  es: esFlag1x1,
  et: etFlag1x1,
  eu: euFlag1x1,
  fi: fiFlag1x1,
  fj: fjFlag1x1,
  fk: fkFlag1x1,
  fm: fmFlag1x1,
  fo: foFlag1x1,
  fr: frFlag1x1,
  ga: gaFlag1x1,
  gb: gbFlag1x1,
  gd: gdFlag1x1,
  ge: geFlag1x1,
  gf: gfFlag1x1,
  gg: ggFlag1x1,
  gh: ghFlag1x1,
  gi: giFlag1x1,
  gl: glFlag1x1,
  gm: gmFlag1x1,
  gn: gnFlag1x1,
  gp: gpFlag1x1,
  gq: gqFlag1x1,
  gr: grFlag1x1,
  gs: gsFlag1x1,
  gt: gtFlag1x1,
  gu: guFlag1x1,
  gw: gwFlag1x1,
  gy: gyFlag1x1,
  hk: hkFlag1x1,
  hm: hmFlag1x1,
  hn: hnFlag1x1,
  hr: hrFlag1x1,
  ht: htFlag1x1,
  hu: huFlag1x1,
  id: idFlag1x1,
  ie: ieFlag1x1,
  il: ilFlag1x1,
  im: imFlag1x1,
  in: inFlag1x1,
  io: ioFlag1x1,
  iq: iqFlag1x1,
  ir: irFlag1x1,
  is: isFlag1x1,
  it: itFlag1x1,
  je: jeFlag1x1,
  jm: jmFlag1x1,
  jo: joFlag1x1,
  jp: jpFlag1x1,
  ke: keFlag1x1,
  kg: kgFlag1x1,
  kh: khFlag1x1,
  ki: kiFlag1x1,
  km: kmFlag1x1,
  kn: knFlag1x1,
  kp: kpFlag1x1,
  kr: krFlag1x1,
  kw: kwFlag1x1,
  ky: kyFlag1x1,
  kz: kzFlag1x1,
  la: laFlag1x1,
  lb: lbFlag1x1,
  lc: lcFlag1x1,
  li: liFlag1x1,
  lk: lkFlag1x1,
  lr: lrFlag1x1,
  ls: lsFlag1x1,
  lt: ltFlag1x1,
  lu: luFlag1x1,
  lv: lvFlag1x1,
  ly: lyFlag1x1,
  ma: maFlag1x1,
  mc: mcFlag1x1,
  md: mdFlag1x1,
  me: meFlag1x1,
  mf: mfFlag1x1,
  mg: mgFlag1x1,
  mh: mhFlag1x1,
  mk: mkFlag1x1,
  ml: mlFlag1x1,
  mm: mmFlag1x1,
  mn: mnFlag1x1,
  mo: moFlag1x1,
  mp: mpFlag1x1,
  mq: mqFlag1x1,
  mr: mrFlag1x1,
  ms: msFlag1x1,
  mt: mtFlag1x1,
  mu: muFlag1x1,
  mv: mvFlag1x1,
  mw: mwFlag1x1,
  mx: mxFlag1x1,
  my: myFlag1x1,
  mz: mzFlag1x1,
  na: naFlag1x1,
  nc: ncFlag1x1,
  ne: neFlag1x1,
  nf: nfFlag1x1,
  ng: ngFlag1x1,
  ni: niFlag1x1,
  nl: nlFlag1x1,
  no: noFlag1x1,
  np: npFlag1x1,
  nr: nrFlag1x1,
  nu: nuFlag1x1,
  nz: nzFlag1x1,
  om: omFlag1x1,
  pa: paFlag1x1,
  pe: peFlag1x1,
  pf: pfFlag1x1,
  pg: pgFlag1x1,
  ph: phFlag1x1,
  pk: pkFlag1x1,
  pl: plFlag1x1,
  pm: pmFlag1x1,
  pn: pnFlag1x1,
  pr: prFlag1x1,
  ps: psFlag1x1,
  pt: ptFlag1x1,
  pw: pwFlag1x1,
  py: pyFlag1x1,
  qa: qaFlag1x1,
  re: reFlag1x1,
  ro: roFlag1x1,
  rs: rsFlag1x1,
  ru: ruFlag1x1,
  rw: rwFlag1x1,
  sa: saFlag1x1,
  sb: sbFlag1x1,
  sc: scFlag1x1,
  sd: sdFlag1x1,
  se: seFlag1x1,
  sg: sgFlag1x1,
  sh: shFlag1x1,
  si: siFlag1x1,
  sj: sjFlag1x1,
  sk: skFlag1x1,
  sl: slFlag1x1,
  sm: smFlag1x1,
  sn: snFlag1x1,
  so: soFlag1x1,
  sr: srFlag1x1,
  ss: ssFlag1x1,
  st: stFlag1x1,
  sv: svFlag1x1,
  sx: sxFlag1x1,
  sy: syFlag1x1,
  sz: szFlag1x1,
  tc: tcFlag1x1,
  td: tdFlag1x1,
  tf: tfFlag1x1,
  tg: tgFlag1x1,
  th: thFlag1x1,
  tj: tjFlag1x1,
  tk: tkFlag1x1,
  tl: tlFlag1x1,
  tm: tmFlag1x1,
  tn: tnFlag1x1,
  to: toFlag1x1,
  tr: trFlag1x1,
  tt: ttFlag1x1,
  tv: tvFlag1x1,
  tw: twFlag1x1,
  tz: tzFlag1x1,
  ua: uaFlag1x1,
  ug: ugFlag1x1,
  um: umFlag1x1,
  un: unFlag1x1,
  us: usFlag1x1,
  uy: uyFlag1x1,
  uz: uzFlag1x1,
  va: vaFlag1x1,
  vc: vcFlag1x1,
  ve: veFlag1x1,
  vg: vgFlag1x1,
  vi: viFlag1x1,
  vn: vnFlag1x1,
  vu: vuFlag1x1,
  wf: wfFlag1x1,
  ws: wsFlag1x1,
  ye: yeFlag1x1,
  yt: ytFlag1x1,
  za: zaFlag1x1,
  zm: zmFlag1x1,
  zw: zwFlag1x1,
};

export const Flags4x3: { [cc: string]: string } = {
  d: globalFlag4x3,
  ad: adFlag4x3,
  ae: aeFlag4x3,
  af: afFlag4x3,
  ag: agFlag4x3,
  ai: aiFlag4x3,
  al: alFlag4x3,
  am: amFlag4x3,
  ao: aoFlag4x3,
  aq: aqFlag4x3,
  ar: arFlag4x3,
  as: asFlag4x3,
  at: atFlag4x3,
  au: auFlag4x3,
  aw: awFlag4x3,
  ax: axFlag4x3,
  az: azFlag4x3,
  ba: baFlag4x3,
  bb: bbFlag4x3,
  bd: bdFlag4x3,
  be: beFlag4x3,
  bf: bfFlag4x3,
  bg: bgFlag4x3,
  bh: bhFlag4x3,
  bi: biFlag4x3,
  bj: bjFlag4x3,
  bl: blFlag4x3,
  bm: bmFlag4x3,
  bn: bnFlag4x3,
  bo: boFlag4x3,
  bq: bqFlag4x3,
  br: brFlag4x3,
  bs: bsFlag4x3,
  bt: btFlag4x3,
  bv: bvFlag4x3,
  bw: bwFlag4x3,
  by: byFlag4x3,
  bz: bzFlag4x3,
  ca: caFlag4x3,
  cc: ccFlag4x3,
  cd: cdFlag4x3,
  cf: cfFlag4x3,
  cg: cgFlag4x3,
  ch: chFlag4x3,
  ci: ciFlag4x3,
  ck: ckFlag4x3,
  cl: clFlag4x3,
  cm: cmFlag4x3,
  cn: cnFlag4x3,
  co: coFlag4x3,
  cr: crFlag4x3,
  cu: cuFlag4x3,
  cv: cvFlag4x3,
  cw: cwFlag4x3,
  cx: cxFlag4x3,
  cy: cyFlag4x3,
  cz: czFlag4x3,
  de: deFlag4x3,
  dj: djFlag4x3,
  dk: dkFlag4x3,
  dm: dmFlag4x3,
  do: doFlag4x3,
  dz: dzFlag4x3,
  ec: ecFlag4x3,
  ee: eeFlag4x3,
  eg: egFlag4x3,
  eh: ehFlag4x3,
  er: erFlag4x3,
  es: esFlag4x3,
  et: etFlag4x3,
  eu: euFlag4x3,
  fi: fiFlag4x3,
  fj: fjFlag4x3,
  fk: fkFlag4x3,
  fm: fmFlag4x3,
  fo: foFlag4x3,
  fr: frFlag4x3,
  ga: gaFlag4x3,
  gb: gbFlag4x3,
  gd: gdFlag4x3,
  ge: geFlag4x3,
  gf: gfFlag4x3,
  gg: ggFlag4x3,
  gh: ghFlag4x3,
  gi: giFlag4x3,
  gl: glFlag4x3,
  gm: gmFlag4x3,
  gn: gnFlag4x3,
  gp: gpFlag4x3,
  gq: gqFlag4x3,
  gr: grFlag4x3,
  gs: gsFlag4x3,
  gt: gtFlag4x3,
  gu: guFlag4x3,
  gw: gwFlag4x3,
  gy: gyFlag4x3,
  hk: hkFlag4x3,
  hm: hmFlag4x3,
  hn: hnFlag4x3,
  hr: hrFlag4x3,
  ht: htFlag4x3,
  hu: huFlag4x3,
  id: idFlag4x3,
  ie: ieFlag4x3,
  il: ilFlag4x3,
  im: imFlag4x3,
  in: inFlag4x3,
  io: ioFlag4x3,
  iq: iqFlag4x3,
  ir: irFlag4x3,
  is: isFlag4x3,
  it: itFlag4x3,
  je: jeFlag4x3,
  jm: jmFlag4x3,
  jo: joFlag4x3,
  jp: jpFlag4x3,
  ke: keFlag4x3,
  kg: kgFlag4x3,
  kh: khFlag4x3,
  ki: kiFlag4x3,
  km: kmFlag4x3,
  kn: knFlag4x3,
  kp: kpFlag4x3,
  kr: krFlag4x3,
  kw: kwFlag4x3,
  ky: kyFlag4x3,
  kz: kzFlag4x3,
  la: laFlag4x3,
  lb: lbFlag4x3,
  lc: lcFlag4x3,
  li: liFlag4x3,
  lk: lkFlag4x3,
  lr: lrFlag4x3,
  ls: lsFlag4x3,
  lt: ltFlag4x3,
  lu: luFlag4x3,
  lv: lvFlag4x3,
  ly: lyFlag4x3,
  ma: maFlag4x3,
  mc: mcFlag4x3,
  md: mdFlag4x3,
  me: meFlag4x3,
  mf: mfFlag4x3,
  mg: mgFlag4x3,
  mh: mhFlag4x3,
  mk: mkFlag4x3,
  ml: mlFlag4x3,
  mm: mmFlag4x3,
  mn: mnFlag4x3,
  mo: moFlag4x3,
  mp: mpFlag4x3,
  mq: mqFlag4x3,
  mr: mrFlag4x3,
  ms: msFlag4x3,
  mt: mtFlag4x3,
  mu: muFlag4x3,
  mv: mvFlag4x3,
  mw: mwFlag4x3,
  mx: mxFlag4x3,
  my: myFlag4x3,
  mz: mzFlag4x3,
  na: naFlag4x3,
  nc: ncFlag4x3,
  ne: neFlag4x3,
  nf: nfFlag4x3,
  ng: ngFlag4x3,
  ni: niFlag4x3,
  nl: nlFlag4x3,
  no: noFlag4x3,
  np: npFlag4x3,
  nr: nrFlag4x3,
  nu: nuFlag4x3,
  nz: nzFlag4x3,
  om: omFlag4x3,
  pa: paFlag4x3,
  pe: peFlag4x3,
  pf: pfFlag4x3,
  pg: pgFlag4x3,
  ph: phFlag4x3,
  pk: pkFlag4x3,
  pl: plFlag4x3,
  pm: pmFlag4x3,
  pn: pnFlag4x3,
  pr: prFlag4x3,
  ps: psFlag4x3,
  pt: ptFlag4x3,
  pw: pwFlag4x3,
  py: pyFlag4x3,
  qa: qaFlag4x3,
  re: reFlag4x3,
  ro: roFlag4x3,
  rs: rsFlag4x3,
  ru: ruFlag4x3,
  rw: rwFlag4x3,
  sa: saFlag4x3,
  sb: sbFlag4x3,
  sc: scFlag4x3,
  sd: sdFlag4x3,
  se: seFlag4x3,
  sg: sgFlag4x3,
  sh: shFlag4x3,
  si: siFlag4x3,
  sj: sjFlag4x3,
  sk: skFlag4x3,
  sl: slFlag4x3,
  sm: smFlag4x3,
  sn: snFlag4x3,
  so: soFlag4x3,
  sr: srFlag4x3,
  ss: ssFlag4x3,
  st: stFlag4x3,
  sv: svFlag4x3,
  sx: sxFlag4x3,
  sy: syFlag4x3,
  sz: szFlag4x3,
  tc: tcFlag4x3,
  td: tdFlag4x3,
  tf: tfFlag4x3,
  tg: tgFlag4x3,
  th: thFlag4x3,
  tj: tjFlag4x3,
  tk: tkFlag4x3,
  tl: tlFlag4x3,
  tm: tmFlag4x3,
  tn: tnFlag4x3,
  to: toFlag4x3,
  tr: trFlag4x3,
  tt: ttFlag4x3,
  tv: tvFlag4x3,
  tw: twFlag4x3,
  tz: tzFlag4x3,
  ua: uaFlag4x3,
  ug: ugFlag4x3,
  um: umFlag4x3,
  un: unFlag4x3,
  us: usFlag4x3,
  uy: uyFlag4x3,
  uz: uzFlag4x3,
  va: vaFlag4x3,
  vc: vcFlag4x3,
  ve: veFlag4x3,
  vg: vgFlag4x3,
  vi: viFlag4x3,
  vn: vnFlag4x3,
  vu: vuFlag4x3,
  wf: wfFlag4x3,
  ws: wsFlag4x3,
  ye: yeFlag4x3,
  yt: ytFlag4x3,
  za: zaFlag4x3,
  zm: zmFlag4x3,
  zw: zwFlag4x3,
};

export const EuropeanCountries: Set<CountryCode> = new Set([
  "AD",
  "AL",
  "AM",
  "AT",
  "BA",
  "BE",
  "BG",
  "BY",
  "CH",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FO",
  "FR",
  "GB",
  "GR",
  "HR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LI",
  "LT",
  "LU",
  "LV",
  "MC",
  "MD",
  "MK",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "RS",
  "RU",
  "SE",
  "SI",
  "SJ",
  "SK",
  "SM",
  "TR",
  "VA",
]);

const NorthAmericaCountries: Set<CountryCode> = new Set([
  "BM",
  "GL",
  "PM",
  "US",
  "CA",
]);

const SouthAmericaCountries: Set<CountryCode> = new Set([
  "SR",
  "PY",
  "AR",
  "FK",
  "CL",
  "EC",
  "UY",
  "BR",
  "GY",
  "PE",
  "VE",
  "CO",
  "BO",
  "GF",
]);

const CentralAmericaAndCaribbeanCountries: Set<CountryCode> = new Set([
  "BB",
  "AI",
  "HT",
  "AW",
  "VC",
  "VI",
  "PR",
  "DO",
  "DM",
  "LC",
  "BS",
  "AG",
  "VG",
  "GP",
  "KY",
  "KN",
  "MQ",
  "JM",
  "GD",
  "TC",
  "MS",
  "TT",
  "MX",
  "SV",
  "PA",
  "CR",
  "HN",
  "GT",
  "BZ",
  "NI",
]);

const AsiaCountries = new Set<CountryCode>([
  "TR",
  "AM",
  "AE",
  "PK",
  "TH",
  "KW",
  "GE",
  "IL",
  "KZ",
  "YE",
  "CN",
  "MO",
  "KH",
  "LB",
  "ID",
  "VN",
  "TW",
  "BH",
  "MY",
  "KG",
  "AZ",
  "PH",
  "BT",
  "HK",
  "SG",
  "LA",
  "KR",
  "OM",
  "BN",
  "MM",
  "JO",
  "SA",
  "MV",
  "IQ",
  "MN",
  "TJ",
  "TM",
  "LK",
  "IN",
  "BD",
  "UZ",
  "JP",
  "CY",
  "AF",
  "NP",
]);

const AfricaCountries = new Set<CountryCode>([
  "GW",
  "RE",
  "EH",
  "LS",
  "BI",
  "TG",
  "SO",
  "NA",
  "SN",
  "ET",
  "MG",
  "MR",
  "SC",
  "SD",
  "GM",
  "UG",
  "ZM",
  "SL",
  "YT",
  "TZ",
  "MW",
  "KE",
  "ST",
  "GN",
  "NG",
  "EG",
  "ZW",
  "GH",
  "CM",
  "MU",
  "RW",
  "TN",
  "NE",
  "LY",
  "AO",
  "CI",
  "ML",
  "KM",
  "CF",
  "SZ",
  "MA",
  "SH",
  "BF",
  "MZ",
  "ZA",
  "GQ",
  "DJ",
  "CG",
  "BW",
  "LR",
  "TD",
  "ER",
  "GA",
  "DZ",
  "CV",
  "BJ",
]);

const OceaniaCountries = new Set<CountryCode>([
  "NR",
  "TO",
  "FM",
  "AU",
  "KI",
  "SB",
  "WF",
  "NF",
  "PF",
  "AS",
  "WS",
  "PG",
  "NC",
  "VU",
  "CK",
  "MH",
  "TV",
  "GU",
  "PN",
  "NU",
  "MP",
  "FJ",
  "NZ",
  "TK",
  "PW",
]);

const countries = {
  EU: i`European Union`,
  US: i`United States`,
  CA: i`Canada`,
  AD: i`Andorra`,
  AE: i`United Arab Emirates`,
  AF: i`Afghanistan`,
  AG: i`Antigua & Barbuda`,
  AI: i`Anguilla`,
  AL: i`Albania`,
  AM: i`Armenia`,
  AN: i`Netherlands Antilles`,
  AO: i`Angola`,
  AQ: i`Antarctica`,
  AR: i`Argentina`,
  AS: i`American Samoa`,
  AT: i`Austria`,
  AU: i`Australia`,
  AW: i`Aruba`,
  AZ: i`Azerbaijan`,
  BA: i`Bosnia and Herzegovina`,
  BB: i`Barbados`,
  BD: i`Bangladesh`,
  BE: i`Belgium`,
  BF: i`Burkina Faso`,
  BG: i`Bulgaria`,
  BH: i`Bahrain`,
  BI: i`Burundi`,
  BJ: i`Benin`,
  BM: i`Bermuda`,
  BN: i`Brunei Darussalam`,
  BO: i`Bolivia`,
  BR: i`Brazil`,
  BS: i`Bahamas`,
  BT: i`Bhutan`,
  BV: i`Bouvet Island`,
  BW: i`Botswana`,
  BY: i`Belarus`,
  BZ: i`Belize`,
  CC: i`Cocos (Keeling) Islands`,
  CF: i`Central African Republic`,
  CG: i`Congo`,
  CH: i`Switzerland`,
  CI: i`Ivory Coast`,
  CK: i`Cook Islands`,
  CL: i`Chile`,
  CM: i`Cameroon`,
  CN: i`Mainland China`,
  CO: i`Colombia`,
  CR: i`Costa Rica`,
  CV: i`Cape Verde`,
  CX: i`Christmas Island`,
  CY: i`Cyprus`,
  CZ: i`Czech Republic`,
  DE: i`Germany`,
  DJ: i`Djibouti`,
  DK: i`Denmark`,
  DM: i`Dominica`,
  DO: i`Dominican Republic`,
  DZ: i`Algeria`,
  EC: i`Ecuador`,
  EE: i`Estonia`,
  EG: i`Egypt`,
  EH: i`Western Sahara`,
  ER: i`Eritrea`,
  ES: i`Spain`,
  ET: i`Ethiopia`,
  FI: i`Finland`,
  FJ: i`Fiji`,
  FK: i`Falkland Islands (Malvinas)`,
  FM: i`Micronesia`,
  FO: i`Faroe Islands`,
  FR: i`France`,
  FX: i`France: Metropolitan`,
  GA: i`Gabon`,
  GB: i`United Kingdom (Great Britain)`,
  GD: i`Grenada`,
  GE: i`Georgia`,
  GF: i`French Guiana`,
  GH: i`Ghana`,
  GI: i`Gibraltar`,
  GL: i`Greenland`,
  GM: i`Gambia`,
  GN: i`Guinea`,
  GP: i`Guadeloupe`,
  GQ: i`Equatorial Guinea`,
  GR: i`Greece`,
  GS: i`South Georgia and the South Sandwich Islands`,
  GT: i`Guatemala`,
  GU: i`Guam`,
  GW: i`Guinea-Bissau`,
  GY: i`Guyana`,
  HK: i`Hong Kong, China`,
  HM: i`Heard & McDonald Islands`,
  HN: i`Honduras`,
  HR: i`Croatia`,
  HT: i`Haiti`,
  HU: i`Hungary`,
  ID: i`Indonesia`,
  IE: i`Ireland`,
  IL: i`Israel`,
  IN: i`India`,
  IO: i`British Indian Ocean Territory`,
  IQ: i`Iraq`,
  IS: i`Iceland`,
  IT: i`Italy`,
  JE: i`Jersey`,
  JM: i`Jamaica`,
  JO: i`Jordan`,
  JP: i`Japan`,
  KE: i`Kenya`,
  KG: i`Kyrgyzstan`,
  KH: i`Cambodia`,
  KI: i`Kiribati`,
  KM: i`Comoros`,
  KN: i`St. Kitts and Nevis`,
  KR: i`South Korea`,
  KW: i`Kuwait`,
  KY: i`Cayman Islands`,
  KZ: i`Kazakhstan`,
  LA: i`Lao People's Democratic Republic`,
  LB: i`Lebanon`,
  LC: i`Saint Lucia`,
  LI: i`Liechtenstein`,
  LK: i`Sri Lanka`,
  LR: i`Liberia`,
  LS: i`Lesotho`,
  LT: i`Lithuania`,
  LU: i`Luxembourg`,
  LV: i`Latvia`,
  LY: i`Libyan Arab Jamahiriya`,
  MA: i`Morocco`,
  MC: i`Monaco`,
  MD: i`Moldova: Republic of`,
  ME: i`Montenegro`,
  MG: i`Madagascar`,
  MH: i`Marshall Islands`,
  MK: i`North Macedonia`,
  ML: i`Mali`,
  MN: i`Mongolia`,
  MM: i`Myanmar`,
  MO: i`Macau, China`,
  MP: i`Northern Mariana Islands`,
  MQ: i`Martinique`,
  MR: i`Mauritania`,
  MS: i`Montserrat`,
  MT: i`Malta`,
  MU: i`Mauritius`,
  MV: i`Maldives`,
  MW: i`Malawi`,
  MX: i`Mexico`,
  MY: i`Malaysia`,
  MZ: i`Mozambique`,
  NA: i`Namibia`,
  NC: i`New Caledonia`,
  NE: i`Niger`,
  NF: i`Norfolk Island`,
  NG: i`Nigeria`,
  NI: i`Nicaragua`,
  NL: i`Netherlands`,
  NO: i`Norway`,
  NP: i`Nepal`,
  NR: i`Nauru`,
  NU: i`Niue`,
  NZ: i`New Zealand`,
  OM: i`Oman`,
  PA: i`Panama`,
  PE: i`Peru`,
  PF: i`French Polynesia`,
  PG: i`Papua New Guinea`,
  PH: i`Philippines`,
  PK: i`Pakistan`,
  PL: i`Poland`,
  PM: i`St. Pierre & Miquelon`,
  PN: i`Pitcairn`,
  PR: i`Puerto Rico`,
  PT: i`Portugal`,
  PW: i`Palau`,
  PY: i`Paraguay`,
  RE: i`Reunion`,
  RO: i`Romania`,
  RU: i`Russia`,
  RW: i`Rwanda`,
  SA: i`Saudi Arabia`,
  SB: i`Solomon Islands`,
  SC: i`Seychelles`,
  SD: i`Sudan`,
  SE: i`Sweden`,
  RS: i`Serbia`,
  SG: i`Singapore`,
  SH: i`St. Helena`,
  SI: i`Slovenia`,
  SJ: i`Svalbard & Jan Mayen Islands`,
  SK: i`Slovakia`,
  SL: i`Sierra Leone`,
  SM: i`San Marino`,
  SN: i`Senegal`,
  SO: i`Somalia`,
  SR: i`Suriname`,
  ST: i`Sao Tome & Principe`,
  SV: i`El Salvador`,
  SZ: i`Swaziland`,
  TC: i`Turks & Caicos Islands`,
  TD: i`Chad`,
  TF: i`French Southern Territories`,
  TG: i`Togo`,
  TH: i`Thailand`,
  TJ: i`Tajikistan`,
  TK: i`Tokelau`,
  TM: i`Turkmenistan`,
  TN: i`Tunisia`,
  TO: i`Tonga`,
  TP: i`East Timor`,
  TR: i`Turkey`,
  TT: i`Trinidad & Tobago`,
  TV: i`Tuvalu`,
  TW: i`Taiwan, China`,
  TZ: i`Tanzania: United Republic of`,
  UG: i`Uganda`,
  UM: i`United States Minor Outlying Islands`,
  UY: i`Uruguay`,
  UZ: i`Uzbekistan`,
  VA: i`Vatican City State (Holy See)`,
  VC: i`St. Vincent & the Grenadines`,
  VE: i`Venezuela`,
  VG: i`Virgin Islands, British`,
  VI: i`Virgin Islands, U.S.`,
  VN: i`Vietnam`,
  VU: i`Vanuatu`,
  WF: i`Wallis & Futuna Islands`,
  WS: i`Samoa`,
  YE: i`Yemen`,
  YT: i`Mayotte`,
  ZA: i`South Africa`,
  ZM: i`Zambia`,
  ZW: i`Zimbabwe`,
  ZR: i`Democratic Republic of the Congo`,
  QA: i`Qatar`,
  UA: i`Ukraine`,
  // TODO: find a fix for this hack
  D: i`Global`,
};

export type { CountryCode };

export const getCountryName = (
  countryCode: CountryCode | "EU" | "D" | null | undefined
): string => {
  if (!countryCode) {
    return "";
  }

  return countries[countryCode] || "";
};

export const REGION_NAMES = {
  EUROPE: i`Europe`,
  NORTH_AMERICA: i`North America`,
  SOUTH_AMERICA: i`South America`,
  CENTRAL_AMERICA_AND_CARIBBEAN: i`Central America and Caribbean`,
  ASIA: i`Asia`,
  AFRICA: i`Africa`,
  OCEANIA: i`Oceania`,
  OTHER: i`Other`,
};

export const getCountryRegion = (countryCode: CountryCode): string => {
  if (EuropeanCountries.has(countryCode)) {
    return REGION_NAMES.EUROPE;
  }
  if (NorthAmericaCountries.has(countryCode)) {
    return REGION_NAMES.NORTH_AMERICA;
  }
  if (SouthAmericaCountries.has(countryCode)) {
    return REGION_NAMES.SOUTH_AMERICA;
  }
  if (CentralAmericaAndCaribbeanCountries.has(countryCode)) {
    return REGION_NAMES.CENTRAL_AMERICA_AND_CARIBBEAN;
  }
  if (AsiaCountries.has(countryCode)) {
    return REGION_NAMES.ASIA;
  }
  if (AfricaCountries.has(countryCode)) {
    return REGION_NAMES.AFRICA;
  }
  if (OceaniaCountries.has(countryCode)) {
    return REGION_NAMES.OCEANIA;
  }
  return REGION_NAMES.OTHER;
};

const module = (countries as any) as { [key in CountryCode]: string };
export default module;
